import { Trans } from "@lingui/react/macro";
import { TabsPanel } from "@mantine/core";
import { IconCircleCheckFilled, IconCircleXFilled, IconFileDatabase } from "@tabler/icons-react";
import { useAppContext } from "../../core/context/AppContext";
import { DataGrid } from "../../core/DataGrid/DataGrid";
import IconWrapper from "../../core/IconWrapper";
import type { RunInfo } from "../../core/types";
import { baseColumns } from "../baseColumns";
import { getExtraData } from "../utils/extra-helpers";

function AdvanceEpochTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize } = useAppContext();
  return (
    <TabsPanel value="advance-epoch">
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
            accessor: "currentEpoch",
            textAlign: "center",
            title: <Trans>Current Epoch</Trans>,
            render: (item) => getExtraData(item, 0, "currentEpoch")
          },
          {
            accessor: "wasAdvanced",
            textAlign: "center",
            title: <Trans>Was Advanced</Trans>,
            render: (item) =>
              getExtraData(item, 0, "wasAdvanced") ? (
                <IconWrapper icon={IconCircleCheckFilled} size={18} color="green" />
              ) : (
                <IconWrapper icon={IconCircleXFilled} size={18} color="red" />
              )
          }
        ]}
      />
    </TabsPanel>
  );
}

export default AdvanceEpochTabPanel;
