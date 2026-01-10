import { Trans } from "@lingui/react/macro";
import { TabsPanel } from "@mantine/core";
import { IconFileDatabase } from "@tabler/icons-react";
import { useAppContext } from "../../core/context/AppContext";
import { DataGrid } from "../../core/DataGrid/DataGrid";
import IconWrapper from "../../core/IconWrapper";
import type { RunInfo } from "../../core/types";
import { baseColumns } from "../baseColumns";
import { getExtraData } from "../utils/extra-helpers";

function CleanupEpochMarkersTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize } = useAppContext();
  return (
    <TabsPanel value="cleanup-epoch-markers">
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
            accessor: "deletedEpochMarkerBlobCount",
            textAlign: "center",
            title: <Trans>Deleted Epoch Marker</Trans>,
            render: (item) => getExtraData(item, 0, "deletedEpochMarkerBlobCount")
          },
          {
            accessor: "deletedWatermarkBlobCount",
            textAlign: "center",
            title: <Trans>Deleted Watermark</Trans>,
            render: (item) => getExtraData(item, 0, "deletedWatermarkBlobCount")
          }
        ]}
      />
    </TabsPanel>
  );
}

export default CleanupEpochMarkersTabPanel;
