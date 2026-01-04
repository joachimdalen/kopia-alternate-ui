import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, Container, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconClick, IconTrash, IconUsers } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { newActionProps, refreshButtonProps } from "../core/commonButtons";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import type { Profile } from "../core/types";
import NewUserModal from "./modals/NewUserModal";

function UsersPage() {
  const { kopiaService } = useServerInstanceContext();
  const { pageSize: tablePageSize } = useAppContext();
  const [data, setData] = useState<Profile[]>([]);
  const [show, setShow] = useDisclosure();

  const loadProfilesAction = useApiRequest({
    action: () => kopiaService.getUsers(),
    onReturn(resp) {
      setData(resp.profiles);
    }
  });

  const deleteProfileAction = useApiRequest({
    action: (username?: string) => kopiaService.deleteUser(username!),
    onReturn(_, username) {
      setData((prev) => prev.filter((x) => x.username !== username));
    }
  });

  const openModal = (username: string) =>
    modals.openConfirmModal({
      title: t`Delete user`,
      children: (
        <Text size="sm">
          <Trans>Are you sure you want to delete the user {username}?</Trans>
        </Text>
      ),
      labels: { confirm: t`Delete user`, cancel: t`No don't delete it` },
      confirmProps: { color: "red", size: "xs" },
      cancelProps: { size: "xs" },
      onConfirm: () => deleteProfileAction.execute(username, username)
    });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only load data on mount
  useEffect(() => {
    loadProfilesAction.execute(undefined, "loading");
  }, []);

  return (
    <Container fluid>
      <Stack>
        <Title order={1}>
          <Trans>Profiles</Trans>
        </Title>
        <Group justify="flex-end" align="flex-end">
          <Group>
            <Button
              loading={loadProfilesAction.loading && loadProfilesAction.loadingKey === "refresh"}
              onClick={setShow.open}
              {...newActionProps}
            >
              <Trans>Add User</Trans>
            </Button>
            <Button
              loading={loadProfilesAction.loading && loadProfilesAction.loadingKey === "refresh"}
              onClick={() => loadProfilesAction.execute(undefined, "refresh")}
              {...refreshButtonProps}
            >
              <Trans>Refresh</Trans>
            </Button>
          </Group>
        </Group>
        <Divider />
        <ErrorAlert error={loadProfilesAction.error} />
        <DataGrid
          loading={loadProfilesAction.loading && loadProfilesAction.loadingKey === "loading"}
          records={data}
          noRecordsText="No users found"
          noRecordsIcon={<IconWrapper icon={IconUsers} size={48} />}
          pageSize={tablePageSize}
          columns={[
            {
              accessor: "username",
              title: t`Username`
            },
            {
              accessor: "name",
              title: t`Name`
            },
            {
              accessor: "host",
              title: t`Hostname`
            },
            {
              accessor: "actions",
              title: <IconClick size={16} />,
              textAlign: "right",
              width: "25%",
              render: (item) => (
                <Group justify="end">
                  <Button
                    size="xs"
                    variant="subtle"
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => openModal(item.username)}
                    loading={deleteProfileAction.loading && deleteProfileAction.loadingKey === item.username}
                  >
                    <Trans>Delete</Trans>
                  </Button>
                </Group>
              )
            }
          ]}
        />
      </Stack>
      {show && (
        <NewUserModal
          onCreated={(profile) => {
            setShow.close();
            setData((prev) => [...prev, profile]);
          }}
          onCancel={setShow.close}
        />
      )}
    </Container>
  );
}

export default UsersPage;
