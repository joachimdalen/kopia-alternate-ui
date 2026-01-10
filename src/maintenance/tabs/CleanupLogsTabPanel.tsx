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

function CleanupLogsTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize, bytesStringBase2 } = useAppContext();
  return (
    <TabsPanel value="cleanup-logs">
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
            accessor: "toDeleteBlobCount",
            textAlign: "center",
            title: <Trans>To Delete</Trans>,
            render: (item) => getExtraData(item, 0, "toDeleteBlobCount")
          },
          {
            accessor: "toDeleteBlobSize",
            textAlign: "right",
            title: <Trans>To Delete Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "toDeleteBlobSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "deletedBlobCount",
            textAlign: "center",
            title: <Trans>Deleted</Trans>,
            render: (item) => getExtraData(item, 0, "deletedBlobCount")
          },
          {
            accessor: "deletedBlobSize",
            textAlign: "right",
            title: <Trans>Delete Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "deletedBlobSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "retainedBlobCount",
            textAlign: "center",
            title: <Trans>Retained</Trans>,
            render: (item) => getExtraData(item, 0, "retainedBlobCount")
          },
          {
            accessor: "retainedBlobSize",
            textAlign: "right",
            title: <Trans>Retained Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "retainedBlobCount") as number) || 0, bytesStringBase2)
          }
        ]}
      />
    </TabsPanel>
  );
}

export default CleanupLogsTabPanel;
