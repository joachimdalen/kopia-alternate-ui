import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  Code,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconFileText,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import FormattedDate from "../core/FormattedDate";
import useApiRequest from "../core/hooks/useApiRequest";
import kopiaService from "../core/kopiaService";
import type { Snapshot, Snapshots, SourceInfo } from "../core/types";
import sizeDisplayName from "../utils/formatSize";
import RetentionBadge from "./components/RetentionBadge";
import UpdateDescriptionModal from "./modals/UpdateDescriptionModal";
const PAGE_SIZES = [10, 20, 30, 40, 50, 100];
function SnapshotHistory() {
  const [searchParams] = useSearchParams();
  console.log(searchParams);
  const [data, setData] = useState<Snapshots>();
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<Snapshot[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<Snapshot[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<
    Snapshot | undefined
  >();
  const sourceInfo: SourceInfo = useMemo(() => {
    return {
      host: searchParams.get("host") as string,
      userName: searchParams.get("userName") as string,
      path: searchParams.get("path") as string,
    };
  }, [searchParams]);

  const { error, execute, loading, loadingKey } = useApiRequest({
    action: () =>
      kopiaService.getSnapshot(
        showAll
          ? {
              ...sourceInfo,
              all: "1",
            }
          : sourceInfo
      ),
    onReturn(resp) {
      console.log("setting", resp);
      setData(resp);
    },
  });

  useEffect(() => {
    execute(undefined, "loading");
  }, [showAll]);

  const visibleData = useMemo(() => {
    if (data === undefined) return [];

    return data.snapshots.slice(0, pageSize);
  }, [data, pageSize]);

  return (
    <Container fluid>
      <Stack>
        <Group>
          <ActionIcon variant="subtle" component={Link} to="/snapshots">
            <IconArrowLeft size={24} />
          </ActionIcon>
          <Title order={1}>Something</Title>
        </Group>
        <Group justify="space-between">
          <Group>
            {selectedRecords.length > 0 && (
              <Button
                size="xs"
                leftSection={<IconTrash size={16} />}
                color="red"
              >
                Delete Selected ({selectedRecords.length})
              </Button>
            )}
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
        <Group justify="space-between">
          <Text fz="sm">
            Displaying{" "}
            {data?.snapshots.length !== data?.unfilteredCount
              ? `${data?.snapshots.length} out of ${data?.unfilteredCount}`
              : data?.snapshots.length}{" "}
            snapshots of{" "}
            <Text fw="bold" span fz="sm">
              {sourceInfo.userName}@{sourceInfo.host}:{sourceInfo.path}
            </Text>
          </Text>
          {data?.unfilteredCount !== data?.uniqueCount && (
            <Checkbox
              label={`Show ${data?.unfilteredCount} individual snapshots`}
              checked={showAll}
              onChange={(event) => setShowAll(event.currentTarget.checked)}
            />
          )}
        </Group>
        <Divider />
        <ErrorAlert error={error} />
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          minHeight={150}
          records={visibleData}
          // define columns
          columns={[
            {
              accessor: "startTime",
              render: (item) => (
                <Anchor
                  component={Link}
                  to={`/snapshots/dir/${item.rootID}`}
                  td="none"
                  fz="sm"
                >
                  <FormattedDate
                    value={item.startTime}
                    format="YYYY-MM-DD h:mm:ss A"
                  />
                </Anchor>
              ),
            },
            {
              accessor: "description",
            },
            {
              accessor: "rootID",
              title: "Root",
              render: (item) => <Code>{item.rootID}</Code>,
            },
            {
              accessor: "retention",
              render: (item) => {
                return (
                  <Group gap="xs">
                    {item.retention.map((z) => (
                      <RetentionBadge retention={z} key={z} />
                    ))}
                  </Group>
                );
              },
            },
            {
              accessor: "summary.size",
              title: "Size",
              textAlign: "center",
              render: (item) => sizeDisplayName(item.summary.size, false),
            },
            { accessor: "summary.files", title: "Files", textAlign: "center" },
            { accessor: "summary.dirs", title: "Dirs", textAlign: "center" },
            {
              accessor: "",
              title: "",
              width: 300,
              render: (item) => {
                return (
                  <Group justify="end">
                    <Button
                      td="none"
                      size="xs"
                      leftSection={<IconFileText size={14} />}
                      variant="subtle"
                      onClick={() => setSelectedSnapshot(item)}
                    >
                      Update description
                    </Button>
                  </Group>
                );
              },
            },
          ]}
          totalRecords={1}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(p) => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          paginationSize="sm"
          fz="sm"
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          fetching={loading && loadingKey === "loading"}
        />
      </Stack>
      {selectedSnapshot && (
        <UpdateDescriptionModal
          snapshot={selectedSnapshot}
          onCancel={() => setSelectedSnapshot(undefined)}
          onUpdated={() => {
            execute(null, "loading");
          }}
        />
      )}
    </Container>
  );
}

export default SnapshotHistory;
