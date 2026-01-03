import { Trans } from "@lingui/react/macro";
import { Card, CardSection, Group, LoadingOverlay, Text } from "@mantine/core";
import { LazyLog } from "@melloware/react-logviewer";
import { useEffect, useState } from "react";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import useApiRequest from "../../core/hooks/useApiRequest";
import type { LogEntry, Task } from "../../core/types";
import { formatLogLine } from "../../utils/formatLogLine";

type Props = {
  task: Task;
};

export default function TaskLogs({ task }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const [data, setData] = useState<LogEntry[]>([]);
  const taskAction = useApiRequest({
    action: (taskId?: string) => kopiaService.getTaskLogs(taskId!),
    onReturn(resp) {
      setData(resp.logs);
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: need-to-fix-later
  useEffect(() => {
    taskAction.execute(task.id, "loading");
  }, [task]);

  return (
    <Card withBorder shadow="sm" radius="md">
      <CardSection withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={500}>
            <Trans>Logs</Trans>
          </Text>
        </Group>
      </CardSection>
      <CardSection mih={500}>
        <LoadingOverlay visible={taskAction.loading} />
        {data.length > 0 && (
          <LazyLog
            caseInsensitive
            enableHotKeys
            enableSearch
            extraLines={1}
            height="500"
            selectableLines
            wrapLines
            text={data.map(formatLogLine).join(` \n`)}
          />
        )}
      </CardSection>
    </Card>
  );
}
