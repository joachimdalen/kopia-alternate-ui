import { Trans } from "@lingui/react/macro";
import {
  Badge,
  Container,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Tabs,
  TabsList,
  TabsTab,
  Text,
  Title
} from "@mantine/core";
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import FormattedDate from "../core/FormattedDate";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import RelativeDate from "../core/RelativeDate";
import type { MaintenanceInfo } from "../core/types";
import { formatDuration } from "../utils/formatDuration";
import AdvanceEpochTabPanel from "./tabs/AdvanceEpochTabPanel";
import CleanupEpochMarkersTabPanel from "./tabs/CleanupEpochMarkersTabPanel";
import CleanupLogsTabPanel from "./tabs/CleanupLogsTabPanel";
import CompactSingleEpochTabPanel from "./tabs/CompactSingleEpochTabPanel";
import DeleteOrphanedBlobsQuickTabPanel from "./tabs/DeleteOrphanedBlobsQuickTabPanel";
import DeleteSupersededEpochIndexesTabPanel from "./tabs/DeleteSupersededEpochIndexesTabPanel";
import ExtendBlobRetentionTimeTabPanel from "./tabs/ExtendBlobRetentionTimeTabPanel";
import FullDeleteBlobsTabPanel from "./tabs/FullDeleteBlobsTabPanel";
import FullDropDeletedContentTabPanel from "./tabs/FullDropDeletedContentTabPanel";
import FullRewriteContentsTabPanel from "./tabs/FullRewriteContentsTabPanel";
import GenerateEpochRangeIndexTabPanel from "./tabs/GenerateEpochRangeIndexTabPanel";
import IndexCompactionTabPanel from "./tabs/IndexCompactionTabPanel";
import QuickRewriteContentsTabPanel from "./tabs/QuickRewriteContentsTabPanel";
import SnapshotGcTabPanel from "./tabs/SnapshotGcTabPanel";

function MaintenancePage() {
  const { kopiaService } = useServerInstanceContext();

  const { pageSize: tablePageSize, bytesStringBase2, locale } = useAppContext();
  const [data, setData] = useState<MaintenanceInfo>();

  const loadAction = useApiRequest({
    action: () => kopiaService.getMaintenanceInfo(),
    onReturn: setData
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only load data on mount
  useEffect(() => {
    loadAction.execute(undefined, "loading");
  }, []);

  const intError = loadAction.error;

  return (
    <Container fluid>
      <Stack>
        <Title order={1}>
          <Trans>Maintenance</Trans>
        </Title>
        <Divider />
        <ErrorAlert error={intError} />

        {data && (
          <SimpleGrid cols={3}>
            <Paper withBorder radius="md" p="xs">
              <Group wrap="nowrap">
                <IconWrapper
                  icon={data.quick?.enabled ? IconCircleCheckFilled : IconCircleXFilled}
                  size={48}
                  color={data.quick?.enabled ? "green" : "red"}
                />

                <div>
                  <Text tt="uppercase" fw={700}>
                    Quick Cycle
                  </Text>
                  <Text fw={700} size="xl">
                    {formatDuration(data?.quick.interval || 0)}
                  </Text>
                  {data?.schedule?.nextQuickMaintenance && (
                    <Text>
                      <Text c="dimmed" span>
                        <FormattedDate value={data.schedule.nextQuickMaintenance} />
                      </Text>{" "}
                      -{" "}
                      <Text c="dimmed" span>
                        <RelativeDate value={data.schedule.nextQuickMaintenance} />
                      </Text>
                    </Text>
                  )}
                </div>
              </Group>
            </Paper>
            <Paper withBorder radius="md" p="xs">
              <Group wrap="nowrap">
                <IconWrapper
                  icon={data.full?.enabled ? IconCircleCheckFilled : IconCircleXFilled}
                  size={48}
                  color={data.full?.enabled ? "green" : "red"}
                />

                <div>
                  <Text tt="uppercase" fw={700}>
                    Full Cycle
                  </Text>
                  <Text fw={700} size="xl">
                    {formatDuration(data?.full.interval || 0)}
                  </Text>
                  {data?.schedule?.nextFullMaintenance && (
                    <Text>
                      <Text c="dimmed" span>
                        <FormattedDate value={data.schedule.nextFullMaintenance} />
                      </Text>{" "}
                      -{" "}
                      <Text c="dimmed" span>
                        <RelativeDate value={data.schedule.nextFullMaintenance} />
                      </Text>
                    </Text>
                  )}
                </div>
              </Group>
            </Paper>
          </SimpleGrid>
        )}

        <Paper
          withBorder
          styles={{
            root: loadAction.loading
              ? {
                  position: "relative"
                }
              : {}
          }}
        >
          <LoadingOverlay visible={loadAction.loading} />
          <Tabs orientation="vertical">
            <TabsList>
              <TabsTab value="advance-epoch">
                <Group justify="space-between">
                  <Text size="sm">Advance Epoch</Text>
                  <Badge color="gray">{data?.schedule.runs["advance-epoch"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="cleanup-epoch-markers">
                <Group justify="space-between">
                  <Text size="sm">Cleanup Epoch Markers</Text>
                  <Badge color="gray">{data?.schedule.runs["cleanup-epoch-markers"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="cleanup-logs">
                <Group justify="space-between">
                  <Text size="sm">Cleanup Logs</Text>
                  <Badge color="gray">{data?.schedule.runs["cleanup-logs"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="compact-single-epoch">
                <Group justify="space-between">
                  <Text size="sm">Compact Single Epoch</Text>
                  <Badge color="gray">{data?.schedule.runs["compact-single-epoch"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="delete-superseded-epoch-indexes">
                <Group justify="space-between">
                  <Text size="sm">Delete Superseded Epoch Indexes</Text>
                  <Badge color="gray">{data?.schedule.runs["delete-superseded-epoch-indexes"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="full-delete-blobs">
                <Group justify="space-between">
                  <Text size="sm">Full Delete Blobs</Text>
                  <Badge color="gray">{data?.schedule.runs["full-delete-blobs"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="full-drop-deleted-content">
                <Group justify="space-between">
                  <Text size="sm">Full Drop Deleted Content</Text>
                  <Badge color="gray">{data?.schedule.runs["full-drop-deleted-content"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="full-rewrite-contents">
                <Group justify="space-between">
                  <Text size="sm">Full Rewrite Contents</Text>
                  <Badge color="gray">{data?.schedule.runs["full-rewrite-contents"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="generate-epoch-range-index">
                <Group justify="space-between">
                  <Text size="sm">Generate Epoch Range Index</Text>
                  <Badge color="gray">{data?.schedule.runs["generate-epoch-range-index"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="snapshot-gc">
                <Group justify="space-between">
                  <Text size="sm">Snapshot Gc</Text>
                  <Badge color="gray">{data?.schedule.runs["snapshot-gc"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="quick-delete-blobs">
                <Group justify="space-between">
                  <Text size="sm">Quick Delete Blobs</Text>
                  <Badge color="gray">{data?.schedule.runs["quick-delete-blobs"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="quick-rewrite-contents">
                <Group justify="space-between">
                  <Text size="sm">Quick Rewrite Contents</Text>
                  <Badge color="gray">{data?.schedule.runs["quick-rewrite-contents"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="index-compaction">
                <Group justify="space-between">
                  <Text size="sm">Index Compaction</Text>
                  <Badge color="gray">{data?.schedule.runs["index-compaction"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
              <TabsTab value="extend-blob-retention-time">
                <Group justify="space-between">
                  <Text size="sm">Extend Blob Retention Time</Text>
                  <Badge color="gray">{data?.schedule.runs["extend-blob-retention-time"]?.length || 0}</Badge>
                </Group>
              </TabsTab>
            </TabsList>
            <AdvanceEpochTabPanel data={data?.schedule.runs["advance-epoch"] || []} loading={loadAction.loading} />
            <CleanupEpochMarkersTabPanel
              data={data?.schedule.runs["cleanup-epoch-markers"] || []}
              loading={loadAction.loading}
            />
            <CleanupLogsTabPanel data={data?.schedule.runs["cleanup-logs"] || []} loading={loadAction.loading} />
            <CompactSingleEpochTabPanel
              data={data?.schedule.runs["compact-single-epoch"] || []}
              loading={loadAction.loading}
            />
            <DeleteSupersededEpochIndexesTabPanel
              data={data?.schedule.runs["delete-superseded-epoch-indexes"] || []}
              loading={loadAction.loading}
            />
            <FullDeleteBlobsTabPanel
              data={data?.schedule.runs["full-delete-blobs"] || []}
              loading={loadAction.loading}
            />
            <FullDropDeletedContentTabPanel
              data={data?.schedule.runs["full-drop-deleted-content"] || []}
              loading={loadAction.loading}
            />
            <FullRewriteContentsTabPanel
              data={data?.schedule.runs["full-rewrite-contents"] || []}
              loading={loadAction.loading}
            />
            <GenerateEpochRangeIndexTabPanel
              data={data?.schedule.runs["generate-epoch-range-index"] || []}
              loading={loadAction.loading}
            />
            <SnapshotGcTabPanel data={data?.schedule.runs["snapshot-gc"] || []} loading={loadAction.loading} />
            <DeleteOrphanedBlobsQuickTabPanel
              data={data?.schedule.runs["quick-delete-blobs"] || []}
              loading={loadAction.loading}
            />
            <QuickRewriteContentsTabPanel
              data={data?.schedule.runs["quick-rewrite-contents"] || []}
              loading={loadAction.loading}
            />
            <IndexCompactionTabPanel
              data={data?.schedule.runs["index-compaction"] || []}
              loading={loadAction.loading}
            />
            <ExtendBlobRetentionTimeTabPanel
              data={data?.schedule.runs["extend-blob-retention-time"] || []}
              loading={loadAction.loading}
            />
          </Tabs>
        </Paper>
      </Stack>
    </Container>
  );
}

export default MaintenancePage;
