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

function SnapshotGcTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize, bytesStringBase2 } = useAppContext();
  return (
    <TabsPanel value="snapshot-gc">
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
            accessor: "unreferencedContentCount",
            textAlign: "center",
            title: <Trans>Unreferenced</Trans>,
            render: (item) => getExtraData(item, 0, "unreferencedContentCount")
          },
          {
            accessor: "unreferencedContentSize",
            textAlign: "right",
            title: <Trans>Unreferenced Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "unreferencedContentSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "deletedContentCount",
            textAlign: "center",
            title: <Trans>Deleted</Trans>,
            render: (item) => getExtraData(item, 0, "deletedContentCount")
          },
          {
            accessor: "deletedContentSize",
            textAlign: "right",
            title: <Trans>Deleted Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "deletedContentSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "unreferencedRecentContentCount",
            textAlign: "center",
            title: <Trans>Unreferenced Recent</Trans>,
            render: (item) => getExtraData(item, 0, "unreferencedRecentContentCount")
          },
          {
            accessor: "unreferencedRecentContentSize",
            textAlign: "right",
            title: <Trans>Unreferenced Recent Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "unreferencedRecentContentSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "inUseContentCount",
            textAlign: "center",
            title: <Trans>In Use</Trans>,
            render: (item) => getExtraData(item, 0, "inUseContentCount")
          },
          {
            accessor: "inUseContentSize",
            textAlign: "right",
            title: <Trans>In Use Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "inUseContentSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "inUseSystemContentCount",
            textAlign: "center",
            title: <Trans>In Use System</Trans>,
            render: (item) => getExtraData(item, 0, "inUseSystemContentCount")
          },
          {
            accessor: "inUseSystemContentSize",
            textAlign: "right",
            title: <Trans>In Use System Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "inUseSystemContentSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "recoveredContentCount",
            textAlign: "center",
            title: <Trans>Recovered</Trans>,
            render: (item) => getExtraData(item, 0, "recoveredContentCount")
          },
          {
            accessor: "recoveredContentSize",
            textAlign: "right",
            title: <Trans>Recovered Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "recoveredContentSize") as number) || 0, bytesStringBase2)
          }
        ]}
      />
    </TabsPanel>
  );
}

export default SnapshotGcTabPanel;
