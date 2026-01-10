import { Trans } from "@lingui/react/macro";
import { TabsPanel } from "@mantine/core";
import { IconFileDatabase } from "@tabler/icons-react";
import { useAppContext } from "../../core/context/AppContext";
import { DataGrid } from "../../core/DataGrid/DataGrid";
import IconWrapper from "../../core/IconWrapper";
import type { RunInfo } from "../../core/types";
import sizeDisplayName from "../../utils/formatSize";
import { baseColumns } from "../baseColumns";
import { getExtraData } from "../utils/extra-helpers";

function DeleteOrphanedBlobsQuickTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize, bytesStringBase2 } = useAppContext();
  return (
    <TabsPanel value="quick-delete-blobs">
      <DataGrid
        records={data}
        loading={loading}
        idAccessor="start"
        noRecordsText="No data"
        noRecordsIcon={<IconWrapper icon={IconFileDatabase} size={48} />}
        pageSize={tablePageSize}
        columns={[
          ...baseColumns,
          {
            accessor: "unreferencedPackCount",
            textAlign: "center",
            title: <Trans>Unreferenced Pack</Trans>,
            render: (item) => getExtraData(item, 0, "unreferencedPackCount")
          },
          {
            accessor: "unreferencedTotalSize",
            textAlign: "right",
            title: <Trans>Unreferenced Pack Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "unreferencedTotalSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "deletedPackCount",
            textAlign: "center",
            title: <Trans>Deleted</Trans>,
            render: (item) => getExtraData(item, 0, "deletedPackCount")
          },
          {
            accessor: "deletedTotalSize",
            textAlign: "right",
            title: <Trans>Deleted Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "deletedTotalSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "retainedPackCount",
            textAlign: "center",
            title: <Trans>Retained</Trans>,
            render: (item) => getExtraData(item, 0, "retainedPackCount")
          },
          {
            accessor: "retainedTotalSize",
            textAlign: "right",
            title: <Trans>Retained Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "retainedTotalSize") as number) || 0, bytesStringBase2)
          }
        ]}
      />
    </TabsPanel>
  );
}

export default DeleteOrphanedBlobsQuickTabPanel;
