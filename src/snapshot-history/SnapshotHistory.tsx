import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Checkbox,
  Code,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconFileDatabase,
  IconFileText,
  IconPin,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { refreshButtonProps } from "../core/commonButtons";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import FormattedDate from "../core/FormattedDate";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import type {
  ItemAction,
  Snapshot,
  Snapshots,
  SourceInfo,
} from "../core/types";
import sizeDisplayName from "../utils/formatSize";
import RetentionBadge from "./components/RetentionBadge";
import DeleteSnapshotModal from "./modals/DeleteSnapshotModal";
import PinSnapshotModal from "./modals/PinSnapshotModal";
import UpdateDescriptionModal from "./modals/UpdateDescriptionModal";
function SnapshotHistory() {
  const { kopiaService } = useServerInstanceContext();
  const { pageSize: tablePageSize, bytesStringBase2 } = useAppContext();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const [data, setData] = useState<Snapshots>();
  const [selectedRecords, setSelectedRecords] = useState<Snapshot[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [itemAction, setItemAction] =
    useState<ItemAction<Snapshot, "description" | "pin" | "delete">>();
  const [pinAction, setPinAction] = useState<ItemAction<string, "pin">>();
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
      setData(resp);
    },
  });

  useEffect(() => {
    execute(undefined, "loading");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAll]);

  return (
    <Container fluid>
      <Stack>
        <Group justify="space-between">
          <Group>
            <ActionIcon variant="subtle" onClick={() => navigate(-1)}>
              <IconArrowLeft size={24} />
            </ActionIcon>
            <Title order={1}>Snapshots: {sourceInfo.path}</Title>
          </Group>
          <Group>
            {selectedRecords.length > 0 && (
              <Button
                size="xs"
                leftSection={<IconTrash size={16} />}
                color="red"
                onClick={() => {
                  setItemAction({ action: "delete" });
                }}
              >
                Delete Selected ({selectedRecords.length})
              </Button>
            )}
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

        <DataGrid
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          loading={loading && loadingKey === "loading"}
          records={data?.snapshots ?? []}
          noRecordsText="No snapshots taken"
          noRecordsIcon={<IconWrapper icon={IconFileDatabase} size={48} />}
          pageSize={tablePageSize}
          columns={[
            {
              accessor: "startTime",
              render: (item) => (
                <Anchor
                  component={Link}
                  to={`/snapshots/dir/${item.rootID}`}
                  state={{ label: searchParams.get("path") }}
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
              width: 600,
              render: (item) => {
                return (
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="xs">
                      {item.retention.map((z) => (
                        <RetentionBadge retention={z} key={z} />
                      ))}
                      {item.pins.map((p) => (
                        <Badge
                          tt="none"
                          radius={5}
                          rightSection={<IconPin size={14} />}
                          onClick={() => {
                            setPinAction({
                              item: p,
                              action: "pin",
                            });
                            setItemAction({ item: item, action: "pin" });
                          }}
                        >
                          {p}
                        </Badge>
                      ))}
                    </Group>
                    <Tooltip label="Add pin to prevent snapshot deletion">
                      <ActionIcon
                        variant="subtle"
                        onClick={() => setItemAction({ item, action: "pin" })}
                      >
                        <IconPin size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                );
              },
            },
            {
              accessor: "summary.size",
              title: "Size",
              textAlign: "center",
              render: (item) =>
                sizeDisplayName(item.summary.size, bytesStringBase2),
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
                      onClick={() =>
                        setItemAction({
                          item,
                          action: "description",
                        })
                      }
                    >
                      Update description
                    </Button>
                  </Group>
                );
              },
            },
          ]}
        />
      </Stack>
      {itemAction?.action === "description" && itemAction?.item && (
        <UpdateDescriptionModal
          snapshot={itemAction.item}
          onCancel={() => setItemAction(undefined)}
          onUpdated={() => {
            execute(null, "loading");
            setItemAction(undefined);
          }}
        />
      )}
      {itemAction?.action === "pin" && itemAction?.item && (
        <PinSnapshotModal
          snapshot={itemAction.item}
          pin={pinAction?.item}
          onCancel={() => setItemAction(undefined)}
          onUpdated={() => {
            execute(null, "loading");
            setItemAction(undefined);
          }}
        />
      )}
      {itemAction?.action == "delete" && selectedRecords.length > 0 && (
        <DeleteSnapshotModal
          onCancel={() => {
            setItemAction(undefined);
          }}
          source={sourceInfo}
          snapshots={selectedRecords}
          isAll={selectedRecords.length === data?.unfilteredCount}
          onDeleted={(deleteAll) => {
            if (deleteAll) {
              navigate(-1);
            } else {
              execute(undefined, "refresh");
            }
            setItemAction(undefined);
            showNotification({
              title: "Snapshot(s) deleted",
              message: "The snapshot(s) was delete successfully",
              color: "green",
            });
            setSelectedRecords([]);
          }}
        />
      )}
    </Container>
  );
}

export default SnapshotHistory;
