import {
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArchive,
  IconClockExclamation,
  IconEye,
  IconFileDatabase,
  IconFolderOpen,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { newActionProps, refreshButtonProps } from "../core/commonButtons";
import { useAppContext } from "../core/context/AppContext";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import { useInterval } from "../core/hooks/useInterval";
import IconWrapper from "../core/IconWrapper";
import kopiaService from "../core/kopiaService";
import { MenuButton } from "../core/MenuButton/MenuButton";
import RelativeDate from "../core/RelativeDate";
import RepoTitle from "../core/RepoTitle/RepoTitle";
import type { SourceInfo, Sources } from "../core/types";
import { formatOwnerName } from "../utils/formatOwnerName";
import sizeDisplayName from "../utils/formatSize";
import { onlyUnique } from "../utils/onlyUnique";
import UploadingLoader from "./components/UploadingLoader";
import NewSnapshotModal from "./modals/NewSnapshotModal";

function SnapshotsPage() {
  const [show, setShow] = useDisclosure();
  const { pageSize: tablePageSize, bytesStringBase2 } = useAppContext();
  const [data, setData] = useState<Sources>();
  const [filterState, setFilterState] = useState<"all" | "local" | string>(
    "all"
  );

  const visibleData = useMemo(() => {
    if (data === undefined) return [];

    let filterable = [...data.sources];

    switch (filterState) {
      case "all":
        break;
      case "local":
        filterable = filterable.filter(
          (x) =>
            formatOwnerName(x.source) ===
            data.localUsername + "@" + data.localHost
        );
        break;
      default:
        filterable = filterable.filter(
          (x) => formatOwnerName(x.source) === filterState
        );
    }

    return filterable;
  }, [data, filterState]);

  const { error, execute, loading, loadingKey } = useApiRequest({
    action: () => kopiaService.getSnapshots(),
    onReturn(resp) {
      setData(resp);
    },
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
    loading: startSnapshotLoading,
    // loadingKey: startSnapshotKey,
  } = useApiRequest({
    action: (data?: SourceInfo) => kopiaService.startSnapshot(data!),
    onReturn() {
      execute(undefined, "refresh");
    },
  });

  const intError = error || newSnapshotError;

  return (
    <Container fluid>
      <Stack>
        <RepoTitle />
        <Group justify="space-between">
          {data?.multiUser === true && (
            <MenuButton
              options={[
                { label: "All Snapshots", value: "all" },
                { label: "Local Snapshots", value: "local" },
                { label: "", value: "divider" },
                ...uniqueOwners.map((own) => ({
                  label: own,
                  value: own,
                })),
              ]}
              onClick={setFilterState}
              disabled={loading && loadingKey == "loading"}
            />
          )}
          <Group>
            <Button
              disabled={loading && loadingKey == "loading"}
              onClick={setShow.open}
              {...newActionProps}
            >
              New Snapshot
            </Button>
            <Button
              loading={loading && loadingKey === "refresh"}
              onClick={() => execute(undefined, "refresh")}
              {...refreshButtonProps}
            >
              Refresh
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
          columns={[
            {
              accessor: "source.path",
              title: "Path",
              render: (item) => (
                <Group gap="5">
                  <IconWrapper icon={IconFolderOpen} color="yellow" size={18} />
                  <Anchor
                    component={Link}
                    to={{
                      pathname: "/snapshots/single-source",
                      search: `?userName=${item.source.userName}&host=${
                        item.source.host
                      }&path=${encodeURIComponent(item.source.path)}`,
                    }}
                    td="none"
                    fz="sm"
                  >
                    {item.source.path}
                  </Anchor>
                </Group>
              ),
            },
            {
              accessor: "owner",
              visibleMediaQuery: (theme) =>
                `(min-width: ${theme.breakpoints.md})`,
              render: (item) => `${item.source.userName}@${item.source.host}`,
            },
            {
              accessor: "lastSnapshot.rootEntry.summ.size",
              title: "Size",
              visibleMediaQuery: (theme) =>
                `(min-width: ${theme.breakpoints.md})`,
              render: (item) =>
                item.lastSnapshot?.rootEntry?.summ?.size &&
                sizeDisplayName(
                  item.lastSnapshot.rootEntry.summ.size,
                  bytesStringBase2
                ),
            },
            {
              accessor: "lastSnapshot.startTime",
              title: "Last Snapshot",
              render: (item) =>
                item.lastSnapshot && (
                  <RelativeDate value={item.lastSnapshot.startTime} />
                ),
            },
            {
              accessor: "nextSnapshotTime",
              render: (item) =>
                item.nextSnapshotTime && (
                  <RelativeDate value={item.nextSnapshotTime} />
                ),
            },
            {
              accessor: "",
              title: "",
              width: 300,
              visibleMediaQuery: (theme) =>
                `(min-width: ${theme.breakpoints.sm})`,
              render: (item) => {
                switch (item.status) {
                  case "IDLE":
                  case "PAUSED": {
                    return (
                      <Group justify="end">
                        <Button
                          component={Link}
                          to={{
                            pathname: "/policies",
                            search: `userName=${item.source.userName}&host=${
                              item.source.host
                            }&path=${encodeURIComponent(
                              item.source.path
                            )}&viewPolicy=true`,
                          }}
                          td="none"
                          size="xs"
                          leftSection={<IconEye size={14} />}
                          variant="subtle"
                        >
                          Policy
                        </Button>
                        <Button
                          size="xs"
                          leftSection={<IconArchive size={14} />}
                          variant="subtle"
                          color="green"
                          loading={startSnapshotLoading}
                          onClick={() => newSnapshot(item.source)}
                        >
                          Snapshot Now
                        </Button>
                      </Group>
                    );
                  }
                  case "PENDING":
                    return (
                      <Group gap={5}>
                        <IconWrapper
                          icon={IconClockExclamation}
                          color="yellow"
                        />
                        <Text fz="xs" c="yellow">
                          Pending
                        </Text>
                      </Group>
                    );
                  case "UPLOADING": {
                    return (
                      <UploadingLoader
                        data={item.upload}
                        bytesStringBase2={bytesStringBase2}
                      />
                    );
                  }

                  default:
                    return item.status;
                }
              },
            },
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
