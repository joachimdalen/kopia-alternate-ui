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

function CompactSingleEpochTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize, bytesStringBase2 } = useAppContext();
  return (
    <TabsPanel value="compact-single-epoch">
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
            accessor: "supersededIndexBlobCount",
            textAlign: "center",
            title: <Trans>Superseded Index</Trans>,
            render: (item) => getExtraData(item, 0, "supersededIndexBlobCount")
          },
          {
            accessor: "supersededIndexTotalSize",
            textAlign: "right",
            title: <Trans>Superseded Index Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "supersededIndexTotalSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "epoch",
            textAlign: "center",
            title: <Trans>Epoch</Trans>,
            render: (item) => getExtraData(item, 0, "epoch")
          }
        ]}
      />
    </TabsPanel>
  );
}

export default CompactSingleEpochTabPanel;
