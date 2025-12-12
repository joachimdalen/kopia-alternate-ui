import {
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconArchive,
  IconClockExclamation,
  IconEye,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import kopiaService from "../core/kopiaService";
import { MenuButton } from "../core/MenuButton/MenuButton";
import RelativeDate from "../core/RelativeDate";
import RepoTitle from "../core/RepoTitle/RepoTitle";
import type { SourceInfo, Sources } from "../core/types";
import { formatOwnerName } from "../utils/formatOwnerName";
import { onlyUnique } from "../utils/onlyUnique";
import UploadingLoader from "./components/UploadingLoader";

function SnapshotsPage() {
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

  // useInterval(() => {
  //   execute(undefined, "fetch");
  // }, 10000);

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
          <Group>
            {/* This flickers on load */}
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
                disabled={loading}
              />
            )}
            <Button
              size="xs"
              leftSection={<IconPlus size={16} />}
              color="green"
              disabled={loading}
              component={Link}
              to="/snapshots/new"
            >
              New Snapshot
            </Button>
          </Group>
          <Button
            size="xs"
            leftSection={<IconRefresh size={16} />}
            variant="light"
            loading={loading && loadingKey === "refresh"}
            onClick={() => execute(undefined, "refresh")}
          >
            Refresh
          </Button>
        </Group>
        <Divider />
        <ErrorAlert error={intError} />
        <DataGrid
          records={visibleData}
          loading={loading && loadingKey === "loading"}
          // define columns
          idAccessor="source.path"
          columns={[
            {
              accessor: "source.path",
              title: "Path",
              render: (item) => (
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
              ),
            },
            {
              accessor: "owner",
              render: (item) => `${item.source.userName}@${item.source.host}`,
            },
            { accessor: "lastSnapshot.rootEntry.summ.size", title: "Size" },
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
                    return <UploadingLoader data={item.upload} />;
                  }

                  default:
                    return item.status;
                }
              },
            },
          ]}
        />
      </Stack>
    </Container>
  );
}

export default SnapshotsPage;
