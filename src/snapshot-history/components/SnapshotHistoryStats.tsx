import { t } from "@lingui/core/macro";
import { SimpleGrid } from "@mantine/core";
import { IconCalendar, IconFiles, IconServer } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../core/context/AppContext";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import formatLocalDate from "../../core/dates/formatLocalDate";
import useApiRequest from "../../core/hooks/useApiRequest";
import type { Snapshot, SourceInfo } from "../../core/types";
import sizeDisplayName from "../../utils/formatSize";
import groupBy from "../../utils/groupBy";
import AreaChartStats from "./AreaChartStats";

type Props = {
  sourceInfo: SourceInfo;
};

export default function SnapshotHistoryStats({ sourceInfo }: Props) {
  const [data, setData] = useState<Snapshot[]>([]);
  const { kopiaService } = useServerInstanceContext();
  const { bytesStringBase2, locale, showStatistics } = useAppContext();
  const loadSnapshots = useApiRequest({
    action: () =>
      kopiaService.getSnapshot({
        ...sourceInfo,
        all: "1"
      }),
    onReturn(resp) {
      setData(resp?.snapshots || []);
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: need-to-fix-later
  useEffect(() => {
    if (showStatistics) {
      loadSnapshots.execute();
    }
  }, [showStatistics]);

  const groupedByDate = useMemo(() => {
    const grouped = groupBy(data, (s) => formatLocalDate(s.startTime, locale, "L"));
    return grouped;
  }, [data, locale]);
  const groupedByDateAndTime = useMemo(() => {
    const grouped = groupBy(data, (s) => formatLocalDate(s.startTime, locale, "L LT"));
    return grouped;
  }, [data, locale]);

  const snapshotsByDate = useMemo(() => {
    const keys = Array.from(groupedByDate.keys());
    return keys.map((k) => {
      return {
        date: k,
        items: groupedByDate.get(k).length
      };
    });
  }, [groupedByDate]);

  const filesAndDirsAndSizeByDate = useMemo(() => {
    const keys = Array.from(groupedByDateAndTime.keys());
    return keys.map((k) => {
      const item: Snapshot = groupedByDateAndTime.get(k)[0];
      return {
        date: k,
        size: item.summary.size,
        dirs: item.summary.dirs,
        files: item.summary.files,
        symlinks: item.summary.symlinks,
        failed: item.summary.numFailed
      };
    });
  }, [groupedByDateAndTime]);

  if (!showStatistics) return null;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      <AreaChartStats
        icon={IconCalendar}
        title={t`Snapshots by date`}
        data={snapshotsByDate}
        dataKey="date"
        series={[{ name: "items", color: "violet.6", label: t`Snapshots` }]}
        loading={loadSnapshots.loading}
      />
      <AreaChartStats
        icon={IconServer}
        title={t`Size over time`}
        data={filesAndDirsAndSizeByDate}
        dataKey="date"
        series={[{ name: "size", color: "blue.6", label: t`Size` }]}
        valueFormatter={(value) => sizeDisplayName(value, bytesStringBase2)}
        loading={loadSnapshots.loading}
      />
      <AreaChartStats
        icon={IconFiles}
        title={t`Entries over time`}
        data={filesAndDirsAndSizeByDate}
        dataKey="date"
        series={[
          { name: "files", color: "yellow.6", label: t`Files` },
          { name: "dirs", color: "green.6", label: t`Directories` },
          { name: "symlinks", color: "lime.6", label: t`Symlinks` },
          { name: "failed", color: "red.6", label: t`Failed` }
        ]}
        loading={loadSnapshots.loading}
      />
    </SimpleGrid>
  );
}
