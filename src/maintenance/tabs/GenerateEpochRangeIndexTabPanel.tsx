import { Trans } from "@lingui/react/macro";
import { TabsPanel } from "@mantine/core";
import { IconFileDatabase } from "@tabler/icons-react";
import { useAppContext } from "../../core/context/AppContext";
import { DataGrid } from "../../core/DataGrid/DataGrid";
import IconWrapper from "../../core/IconWrapper";
import type { RunInfo } from "../../core/types";
import { baseColumns } from "../baseColumns";
import { getExtraData } from "../utils/extra-helpers";

function GenerateEpochRangeIndexTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize } = useAppContext();
  return (
    <TabsPanel value="generate-epoch-range-index">
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
            accessor: "rangeMinEpoch",
            textAlign: "center",
            title: <Trans>Min Epoch</Trans>,
            render: (item) => getExtraData(item, 0, "rangeMinEpoch")
          },
          {
            accessor: "rangeMaxEpoch",
            textAlign: "center",
            title: <Trans>Max Epoch</Trans>,
            render: (item) => getExtraData(item, 0, "rangeMaxEpoch")
          }
        ]}
      />
    </TabsPanel>
  );
}

export default GenerateEpochRangeIndexTabPanel;
