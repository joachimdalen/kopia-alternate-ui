import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Anchor, Badge, Button, Container, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconArchive,
  IconCircleCheck,
  IconClockExclamation,
  IconEye,
  IconFileDatabase,
  IconFolderOpen,
  IconRefreshAlert
} from "@tabler/icons-react";
import sortBy from "lodash.sortby";
import type { DataTableSortStatus } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { newActionProps, refreshButtonProps } from "../core/commonButtons";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import { useInterval } from "../core/hooks/useInterval";
import IconWrapper from "../core/IconWrapper";
import { MenuButton } from "../core/MenuButton/MenuButton";
import RelativeDate from "../core/RelativeDate";
import type { SourceInfo, SourceStatus, Sources } from "../core/types";
import { formatOwnerName } from "../utils/formatOwnerName";
import sizeDisplayName from "../utils/formatSize";
import { onlyUnique } from "../utils/onlyUnique";
import UploadingLoader from "./components/UploadingLoader";
import NewSnapshotModal from "./modals/NewSnapshotModal";

function SnapshotsPage() {
  const { kopiaService } = useServerInstanceContext();
  const [show, setShow] = useDisclosure();
  const { pageSize: tablePageSize, bytesStringBase2 } = useAppContext();
  const [data, setData] = useState<Sources>();
  const [filterState, setFilterState] = useState<"all" | "local" | string>("all");
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<SourceStatus>>({
    columnAccessor: "source.path",
    direction: "asc"
  });

  const visibleData = useMemo(() => {
    if (data === undefined) return [];

    let filterable = [...data.sources];

    switch (filterState) {
      case "all":
        break;
      case "local":
        filterable = filterable.filter((x) => formatOwnerName(x.source) === data.localUsername + "@" + data.localHost);
        break;
      default:
        filterable = filterable.filter((x) => formatOwnerName(x.source) === filterState);
    }

    const entries = sortBy(filterable, sortStatus.columnAccessor) as SourceStatus[];
    return sortStatus.direction === "desc" ? entries.reverse() : entries;
  }, [data, filterState, sortStatus]);

  const { error, execute, loading, loadingKey } = useApiRequest({
    action: () => kopiaService.getSnapshots(),
    onReturn(resp) {
      setData(resp);
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only load data on mount
  useEffect(() => {
    execute(undefined, "loading");
  }, []);

  useInterval(() => {
    execute(undefined, "fetch");
  }, 3000);

  const uniqueOwners = (data?.sources || [])
    .map((x) => formatOwnerName(x.source))
    .filter(onlyUnique)
    .sort();

  const {
    error: newSnapshotError,
    execute: newSnapshot,
    loading: startSnapshotLoading
    // loadingKey: startSnapshotKey,
  } = useApiRequest({
    action: (data?: SourceInfo) => kopiaService.startSnapshot(data!),
    onReturn() {
      execute(undefined, "refresh");
    }
  });
  const syncAction = useApiRequest({
    action: () => kopiaService.syncRepo(),
    showErrorAsNotification: true,
    onReturn() {
      execute(undefined, "refresh");
      showNotification({
        title: t`Repository synchronized`,
        message: t`The repository was synchronized successfully`,
        color: "green",
        icon: <IconCircleCheck size={16} />
      });
    }
  });
  const intError = error || newSnapshotError;

  return (
    <Container fluid>
      <Stack>
        <Title order={1}>
          <Trans>Snapshots</Trans>
        </Title>
        <Group justify={data?.multiUser === false ? "end" : "space-between"}>
          {data?.multiUser === true && (
            <MenuButton
              options={[
                { label: <Trans>All Snapshots</Trans>, value: "all" },
                { label: <Trans>Local Snapshots</Trans>, value: "local" },
                { label: "", value: "divider" },
                ...uniqueOwners.map((own) => ({
                  label: own,
                  value: own
                }))
              ]}
              onClick={setFilterState}
              disabled={loading && loadingKey == "loading"}
            />
          )}
          <Group>
            <Button disabled={loading && loadingKey == "loading"} onClick={setShow.open} {...newActionProps}>
              <Trans>New Snapshot</Trans>
            </Button>
            <Button
              loading={loading && loadingKey === "refresh"}
              onClick={() => execute(undefined, "refresh")}
              {...refreshButtonProps}
            >
              <Trans>Refresh</Trans>
            </Button>
            <Button
              loading={syncAction.loading}
              onClick={() => syncAction.execute()}
              {...refreshButtonProps}
              leftSection={<IconRefreshAlert size={16} />}
              color="grape"
            >
              <Trans>Sync</Trans>
            </Button>
          </Group>
        </Group>
        <Divider />
        <ErrorAlert error={intError} />
        <DataGrid
          records={visibleData}
          loading={loading && loadingKey === "loading"}
          idAccessor="source.path"
          noRecordsText="No snapshots taken"
          noRecordsIcon={<IconWrapper icon={IconFileDatabase} size={48} />}
          pageSize={tablePageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          columns={[
            {
              accessor: "source.path",
              title: <Trans>Path</Trans>,
              sortable: true,
              render: (item) => (
                <Group gap="5">
                  <IconWrapper icon={IconFolderOpen} color="yellow" size={18} />
                  <Anchor
                    component={Link}
                    to={{
                      pathname: "/snapshots/single-source",
                      search: `?userName=${item.source.userName}&host=${item.source.host}&path=${encodeURIComponent(item.source.path)}`
                    }}
                    td="none"
                    fz="sm"
                  >
                    {item.source.path}
                  </Anchor>
                </Group>
              )
            },
            {
              accessor: "owner",
              title: <Trans>Owner</Trans>,
              sortable: true,
              visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
              render: (item) =>
                item.status === "REMOTE" ? (
                  <Group gap="xs" align="center">
                    <Text fz="sm">{`${item.source.userName}@${item.source.host}`}</Text>
                    <Badge size="sm" radius={5} tt="none" variant="light" color="grape">
                      <Trans>Remote</Trans>
                    </Badge>
                  </Group>
                ) : (
                  `${item.source.userName}@${item.source.host}`
                )
            },
            {
              accessor: "lastSnapshot.rootEntry.summ.size",
              sortable: true,
              title: <Trans>Size</Trans>,
              visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`,
              render: (item) =>
                item.lastSnapshot?.rootEntry?.summ?.size &&
                sizeDisplayName(item.lastSnapshot.rootEntry.summ.size, bytesStringBase2)
            },
            {
              accessor: "lastSnapshot.startTime",
              sortable: true,
              title: <Trans>Last Snapshot</Trans>,
              render: (item) => item.lastSnapshot && <RelativeDate value={item.lastSnapshot.startTime} />
            },
            {
              accessor: "nextSnapshotTime",
              title: <Trans>Next snapshot</Trans>,
              render: (item) => item.nextSnapshotTime && <RelativeDate value={item.nextSnapshotTime} />
            },
            {
              accessor: "",
              title: "",
              width: 300,
              visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.sm})`,
              render: (item) => {
                switch (item.status) {
                  case "IDLE":
                  case "PAUSED":
                  case "REMOTE": {
                    return (
                      <Group justify="end">
                        {item.status !== "REMOTE" && (
                          <Button
                            size="xs"
                            leftSection={<IconArchive size={14} />}
                            variant="subtle"
                            color="green"
                            loading={startSnapshotLoading}
                            onClick={() => newSnapshot(item.source)}
                          >
                            <Trans>Snapshot Now</Trans>
                          </Button>
                        )}
                        <Button
                          component={Link}
                          to={{
                            pathname: "/policies",
                            search: `userName=${item.source.userName}&host=${item.source.host}&path=${encodeURIComponent(item.source.path)}&viewPolicy=true`
                          }}
                          td="none"
                          size="xs"
                          leftSection={<IconEye size={14} />}
                          variant="subtle"
                        >
                          <Trans>View Policy</Trans>
                        </Button>
                      </Group>
                    );
                  }
                  case "PENDING":
                    return (
                      <Group gap={5}>
                        <IconWrapper icon={IconClockExclamation} color="yellow" />
                        <Text fz="xs" c="yellow">
                          <Trans>Pending</Trans>
                        </Text>
                      </Group>
                    );
                  case "UPLOADING": {
                    return <UploadingLoader data={item.upload} bytesStringBase2={bytesStringBase2} />;
                  }
                  default:
                    return item.status;
                }
              }
            }
          ]}
        />
      </Stack>
      {show && (
        <NewSnapshotModal
          onSnapshotted={() => {
            setShow.close();
            execute(undefined, "refresh");
          }}
          onCancel={setShow.close}
        />
      )}
    </Container>
  );
}

export default SnapshotsPage;
