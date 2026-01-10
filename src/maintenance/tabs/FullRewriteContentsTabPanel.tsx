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

function FullRewriteContentsTabPanel({ data, loading }: { data: RunInfo[]; loading: boolean }) {
  const { pageSize: tablePageSize, bytesStringBase2 } = useAppContext();
  return (
    <TabsPanel value="full-rewrite-contents">
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
            accessor: "toRewriteContentCount",
            textAlign: "center",
            title: <Trans>To Rewrite Content</Trans>,
            render: (item) => getExtraData(item, 0, "toRewriteContentCount")
          },
          {
            accessor: "toRewriteContentSize",
            textAlign: "right",
            title: <Trans>To Rewrite Content Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "toRewriteContentSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "rewrittenContentCount",
            textAlign: "center",
            title: <Trans>Rewritten Content</Trans>,
            render: (item) => getExtraData(item, 0, "rewrittenContentCount")
          },
          {
            accessor: "rewrittenContentSize",
            textAlign: "right",
            title: <Trans>Rewritten Content Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "rewrittenContentSize") as number) || 0, bytesStringBase2)
          },
          {
            accessor: "retainedContentCount",
            textAlign: "center",
            title: <Trans>Retained Content</Trans>,
            render: (item) => getExtraData(item, 0, "retainedContentCount")
          },
          {
            accessor: "retainedContentSize",
            textAlign: "right",
            title: <Trans>Retained Content Size</Trans>,
            render: (item) =>
              sizeDisplayName((getExtraData(item, 0, "retainedContentSize") as number) || 0, bytesStringBase2)
          }
        ]}
      />
    </TabsPanel>
  );
}

export default FullRewriteContentsTabPanel;
