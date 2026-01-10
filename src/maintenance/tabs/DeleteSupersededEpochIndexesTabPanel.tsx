import { Trans } from "@lingui/react/macro";
import { TabsPanel } from "@mantine/core";
import { IconFileDatabase } from "@tabler/icons-react";
import { useAppContext } from "../../core/context/AppContext";
import { DataGrid } from "../../core/DataGrid/DataGrid";
import FormattedDate from "../../core/FormattedDate";
import IconWrapper from "../../core/IconWrapper";
import type { RunInfo } from "../../core/types";
import sizeDisplayName from "../../utils/formatSize";
import { baseColumns } from "../baseColumns";
import { getExtraData } from "../utils/extra-helpers";

function DeleteSupersededEpochIndexesTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize, bytesStringBase2 } = useAppContext();
  return (
    <TabsPanel value="delete-superseded-epoch-indexes">
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
            accessor: "maxReplacementTime",
            title: <Trans>Max Replacement Time</Trans>,
            render: (item) => {
              const maxReplacementTime = getExtraData(item, 0, "maxReplacementTime");
              if (!maxReplacementTime) return null;
              return <FormattedDate value={maxReplacementTime as string} />;
            }
          },
          {
            accessor: "deletedBlobCount",
            textAlign: "center",
            title: <Trans>Deleted</Trans>,
            render: (item) => getExtraData(item, 0, "deletedBlobCount")
          },
          {
            accessor: "deletedTotalSize",
            textAlign: "right",
            title: <Trans>Deleted Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "deletedTotalSize") as number) || 0, bytesStringBase2)
          }
        ]}
      />
    </TabsPanel>
  );
}

export default DeleteSupersededEpochIndexesTabPanel;
