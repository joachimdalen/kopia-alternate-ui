import { Trans } from "@lingui/react/macro";
import { TabsPanel } from "@mantine/core";
import { IconFileDatabase } from "@tabler/icons-react";
import { useAppContext } from "../../core/context/AppContext";
import { DataGrid } from "../../core/DataGrid/DataGrid";
import IconWrapper from "../../core/IconWrapper";
import type { RunInfo } from "../../core/types";
import { baseColumns } from "../baseColumns";
import { getExtraData } from "../utils/extra-helpers";

function ExtendBlobRetentionTimeTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize } = useAppContext();
  return (
    <TabsPanel value="extend-blob-retention-time">
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
            accessor: "toExtendBlobCount",
            textAlign: "center",
            title: <Trans>To Extend</Trans>,
            render: (item) => getExtraData(item, 0, "toExtendBlobCount")
          },
          {
            accessor: "extendedBlobCount",
            textAlign: "center",
            title: <Trans>Extended</Trans>,
            render: (item) => getExtraData(item, 0, "extendedBlobCount")
          },
          {
            accessor: "retentionPeriod",
            textAlign: "center",
            title: <Trans>Retention Period</Trans>,
            render: (item) => getExtraData(item, 0, "retentionPeriod")
          }
        ]}
      />
    </TabsPanel>
  );
}

export default ExtendBlobRetentionTimeTabPanel;
