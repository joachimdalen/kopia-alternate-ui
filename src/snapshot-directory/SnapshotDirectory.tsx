import {
  ActionIcon,
  Alert,
  Anchor,
  Button,
  Container,
  CopyButton,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  useDebouncedValue,
  useDisclosure,
  useInputState,
  usePrevious,
} from "@mantine/hooks";
import {
  IconArrowLeft,
  IconCheck,
  IconCopy,
  IconFile,
  IconFileDelta,
  IconFileDownload,
  IconFolderBolt,
  IconFolderMinus,
  IconFolderOpen,
  IconFolderShare,
  IconSearch,
} from "@tabler/icons-react";
import sortBy from "lodash.sortby";
import type { DataTableSortStatus } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { refreshButtonProps } from "../core/commonButtons";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import FormattedDate from "../core/FormattedDate";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import { type MountedSnapshot, type DirEntry, type DirManifest } from "../core/types";
import sizeDisplayName from "../utils/formatSize";
import DirectoryCrumbs from "./components/DirectoryCrumbs";
import { fileIcons } from "./fileIcons";
import RestoreModal from "./modals/RestoreModal";
import MountButton from "./components/MountButton";
const getFileIcon = (name: string) => {
  const parts = name.split(".");
  const ext = parts[parts.length - 1];

  const iconMapping = fileIcons[ext];
  if (iconMapping === undefined) return IconFile;
  return iconMapping;
};

function SnapshotDirectory() {
  const { kopiaService } = useServerInstanceContext();
  const { pageSize: tablePageSize, bytesStringBase2 } = useAppContext();
  const { oid } = useParams();
  const previousOid = usePrevious(oid);
  const navigate = useNavigate();
  const [data, setData] = useState<DirManifest>();
  const [mount, setMount] = useState<MountedSnapshot>();
  const location = useLocation();
  const [show, setShow] = useDisclosure();
  const [query, setQuery] = useInputState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<DirEntry>>({
    columnAccessor: "name",
    direction: "asc",
  });

  const { error, execute, loading, loadingKey } = useApiRequest({
    action: () => kopiaService.getObjects(oid as string),
    onReturn(resp) {
      setData(resp);
    },
  });

  const getMountAction = useApiRequest({
    action: (oid?: string) => kopiaService.getMountedSnapshot(oid!),
    onReturn(mnt) {
      setMount(mnt)
    }
  });

  useEffect(() => {
    if (previousOid != oid) {
      execute(undefined, "loading");
      getMountAction.execute(oid);
    }
  }, [oid]);

  const visibleItems = useMemo(() => {
    let items = [...(data?.entries || [])];

    if (debouncedQuery !== "") {
      items = items.filter((x) => x.name.indexOf(debouncedQuery) !== -1);
    }

    const entries = sortBy(items, sortStatus.columnAccessor) as DirEntry[];
    return sortStatus.direction === "desc" ? entries.reverse() : entries;
  }, [data, debouncedQuery, sortStatus]);

  return (
    <Container fluid>
      <Stack>
        <Group justify="space-between">
          <Group>
            <ActionIcon variant="subtle" onClick={() => navigate(-1)}>
              <IconArrowLeft size={24} />
            </ActionIcon>
            <Stack gap={0}>
              <Title order={1}>Snapshot: {oid}</Title>
              <DirectoryCrumbs />
            </Stack>
          </Group>

          <Group>
            <TextInput
              size="sm"
              placeholder="Search files or folder (current level)"
              leftSection={<IconSearch size={18} stroke={1.5} />}
              value={query}
              onChange={setQuery}
            />
            <Button
              size="xs"
              color="indigo"
              leftSection={<IconFileDelta size={16} />}
              onClick={setShow.open}
            >
              Restore
            </Button>
            {oid && <MountButton mount={mount} rootID={oid} onMounted={(mnt) => setMount(mnt)} />}
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
        <ErrorAlert error={error} />
        {mount && <Alert title="Snapshot Mounted" color="grape">
          Snapshot is mounted at the following path:
          <TextInput readOnly defaultValue={mount.path} rightSection={<CopyButton value={mount.path} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>} />
        </Alert>}
        <DataGrid
          idAccessor="obj"
          loading={loading && loadingKey === "loading"}
          records={visibleItems}
          noRecordsText={
            debouncedQuery !== ""
              ? "No entires matching your search"
              : "No entries in folder"
          }
          noRecordsIcon={<IconWrapper icon={IconFolderOpen} size={48} />}
          pageSize={tablePageSize}
          columns={[
            {
              accessor: "name",
              sortable: true,
              render: (item) =>
                item.obj.startsWith("k") ? (
                  <Group gap="5">
                    <IconWrapper
                      icon={IconFolderOpen}
                      color="yellow"
                      size={18}
                    />
                    <Anchor
                      component={Link}
                      to={`/snapshots/dir/${item.obj}`}
                      state={{
                        label: item.name,
                        oid: item.obj,
                        prevState: location.state,
                      }}
                      td="none"
                      fz="sm"
                    >
                      {item.name}
                    </Anchor>
                  </Group>
                ) : (
                  <Group gap="5">
                    <IconWrapper
                      icon={getFileIcon(item.name)}
                      color="blue"
                      size={18}
                    />
                    <Text fz="sm">{item.name}</Text>
                  </Group>
                ),
            },
            {
              accessor: "mtime",
              sortable: true,
              sortKey: "mtime",
              title: "Last Modification",
              render: (item) => <FormattedDate value={item.mtime} />,
            },

            {
              accessor: "size",
              title: "Size",
              textAlign: "right",
              render: (item) =>
                sizeDisplayName(
                  item.type === "d" ? item.summ?.size || 0 : item.size || 0,
                  bytesStringBase2
                ),
            },
            {
              accessor: "summ.files",
              sortable: true,
              title: "Files",
              textAlign: "center",
            },
            {
              accessor: "summ.dirs",
              sortable: true,
              title: "Dirs",
              textAlign: "center",
            },
            {
              accessor: "",
              width: 200,
              render: (item) =>
                !item.obj.startsWith("k") && (
                  <Button
                    component="a"
                    href={`/api/v1/objects/${item.obj
                      }?fname=${encodeURIComponent(item.name)}`}
                    td="none"
                    size="xs"
                    leftSection={<IconFileDownload size={14} />}
                    variant="subtle"
                  >
                    Download
                  </Button>
                ),
            },
          ]}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
        />
      </Stack>
      {show && oid && (
        <RestoreModal
          onRestoreStarted={(task) => {
            setShow.close();
            navigate(`/tasks/${task.id}`);
          }}
          oid={oid}
          onCancel={setShow.close}
        />
      )}
    </Container>
  );
}

export default SnapshotDirectory;
