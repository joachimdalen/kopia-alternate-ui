import { Trans } from "@lingui/react/macro";
import { Card, CardSection, Group, LoadingOverlay, Text } from "@mantine/core";
import { LazyLog } from "@melloware/react-logviewer";
import { useEffect, useState } from "react";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import { formatTimestamp } from "../../core/formatTimestamp";
import useApiRequest from "../../core/hooks/useApiRequest";
import type { Task } from "../../core/types";

type Props = {
  task: Task;
};

export default function TaskLogs({ task }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const [data, setData] = useState<
    {
      level: number;
      ts: number;
      msg: string;
      mod: string;
    }[]
  >([]);
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
            text={data
              .map((l) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { level, ts, msg, mod, ...rest } = l;
                const parts = JSON.stringify(rest);
                const timespan = formatTimestamp(new Date(ts * 1000));
                const message = msg;
                const partText = parts === "{}" ? "" : parts;
                return `\x1b[34m ${timespan}\x1b[0m : ${message} \x1b[35m ${partText}\x1b[0m`;
              })
              .join(` \n`)}
          />
        )}
      </CardSection>
    </Card>
  );
}
