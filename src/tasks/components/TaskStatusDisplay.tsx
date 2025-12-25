import { Group, Loader, Text, Tooltip } from "@mantine/core";
import type { Task } from "../../core/types";

import { Trans } from "@lingui/react/macro";
import { IconBan, IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import TimeDuration from "../../core/TimeDuration";
type Props = {
  task: Task;
};

export default function TaskStatusDisplay({ task }: Props) {
  switch (task.status) {
    case "RUNNING":
      return (
        <Group gap="xs">
          <Loader type="dots" size="xs" />
          <Text fz="sm">
            <Trans>Running for</Trans> <TimeDuration from={task.startTime} to={task.endTime!} />
          </Text>
        </Group>
      );
    case "SUCCESS":
      return (
        <Group gap="xs">
          <IconCircleCheckFilled color="var(--mantine-color-green-5)" />
          <Text fz="sm">
            <Trans>Finished in</Trans> <TimeDuration from={task.startTime} to={task.endTime!} />
          </Text>
        </Group>
      );
    case "FAILED":
      return (
        <Group gap="xs">
          <IconCircleXFilled color="var(--mantine-color-red-5)" />
          <Tooltip label={task.errorMessage || "No error message given"}>
            <Text fz="sm">
              <Trans>Failed after</Trans> <TimeDuration from={task.startTime} to={task.endTime!} />
            </Text>
          </Tooltip>
        </Group>
      );
    case "CANCELED":
      return (
        <Group gap="xs">
          <IconBan color="var(--mantine-color-yellow-5)" />
          <Text fz="sm">
            <Trans>Canceled after</Trans> <TimeDuration from={task.startTime} to={task.endTime!} />
          </Text>
        </Group>
      );
  }
}
