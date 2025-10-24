import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Stack,
} from "@mantine/core";
import { useDisclosure, usePrevious } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconFileDelta,
  IconFileDownload,
  IconFolderOpen,
  IconRefresh,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import FormattedDate from "../core/FormattedDate";
import useApiRequest from "../core/hooks/useApiRequest";
import kopiaService from "../core/kopiaService";
import RepoTitle from "../core/RepoTitle/RepoTitle";
import type { DirManifest } from "../core/types";
import sizeDisplayName from "../utils/formatSize";
import DirectoryCrumbs from "./components/DirectoryCrumbs";
import RestoreModal from "./modals/RestoreModal";

function SnapshotDirectory() {
  const { oid } = useParams();
  const previousOid = usePrevious(oid);
  const [data, setData] = useState<DirManifest>();
  const location = useLocation();
  const [show, setShow] = useDisclosure();
  const { error, execute, loading, loadingKey } = useApiRequest({
    action: () => kopiaService.getObjects(oid as string),
    onReturn(resp) {
      setData(resp);
    },
  });

  useEffect(() => {
    if (previousOid != oid) {
      execute(undefined, "loading");
    }
  }, [oid]);

  return (
    <Container fluid>
      <Stack>
        <Group>
          <ActionIcon variant="subtle" component={Link} to="/snapshots">
            <IconArrowLeft size={24} />
          </ActionIcon>
          <RepoTitle />
        </Group>

        <Group justify="space-between" align="flex-end">
          <Stack>
            <DirectoryCrumbs />
            <Button
              size="xs"
              leftSection={<IconFileDelta size={16} />}
              onClick={setShow.open}
            >
              Restore
            </Button>
          </Stack>
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

        <ErrorAlert error={error} />

        <DataGrid
          idAccessor="obj"
          loading={loading && loadingKey === "loading"}
          records={data?.entries ?? []}
          noRecordsText="No entries in folder"
          noRecordsIcon={<IconFolderOpen size={48} />}
          columns={[
            {
              accessor: "name",
              render: (item) =>
                item.obj.startsWith("k") ? (
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
                ) : (
                  item.name
                ),
            },
            {
              accessor: "lastModification",
              render: (item) => (
                <FormattedDate
                  value={item.mtime}
                  format="YYYY-MM-DD h:mm:ss A"
                />
              ),
            },

            {
              accessor: "size",
              title: "Size",
              textAlign: "center",
              render: (item) => sizeDisplayName(item.summ?.size ?? 0, false),
            },
            { accessor: "summ.files", title: "Files", textAlign: "center" },
            { accessor: "summ.dirs", title: "Dirs", textAlign: "center" },
            {
              accessor: "",
              width: 200,
              render: (item) =>
                !item.obj.startsWith("k") && (
                  <Button
                    component="a"
                    href={`/api/v1/objects/${
                      item.obj
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
        />
      </Stack>
      {show && oid && (
        <RestoreModal
          onRestoreStarted={() => console.log("ok")}
          oid={oid}
          onCancel={setShow.close}
        />
      )}
    </Container>
  );
}

export default SnapshotDirectory;
