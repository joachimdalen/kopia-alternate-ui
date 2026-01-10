import { Trans } from "@lingui/react/macro";
import { TabsPanel } from "@mantine/core";
import { IconFileDatabase } from "@tabler/icons-react";
import { useAppContext } from "../../core/context/AppContext";
import { DataGrid } from "../../core/DataGrid/DataGrid";
import FormattedDate from "../../core/FormattedDate";
import IconWrapper from "../../core/IconWrapper";
import type { RunInfo } from "../../core/types";
import { baseColumns } from "../baseColumns";
import { getExtraData } from "../utils/extra-helpers";

function FullDropDeletedContentTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize } = useAppContext();
  return (
    <TabsPanel value="full-drop-deleted-content">
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
            accessor: "droppedContentsDeletedBefore",
            title: <Trans>Dropped Contents Deleted Before</Trans>,
            render: (item) => {
              const droppedContentsDeletedBefore = getExtraData(item, 0, "droppedContentsDeletedBefore");
              if (!droppedContentsDeletedBefore) return null;
              return <FormattedDate value={droppedContentsDeletedBefore as string} />;
            }
          }
        ]}
      />
    </TabsPanel>
  );
}

export default FullDropDeletedContentTabPanel;
