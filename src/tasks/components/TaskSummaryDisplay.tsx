import { Alert, Group, Loader, Text } from "@mantine/core";
import {
  IconBan,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from "@tabler/icons-react";
import TimeDuration from "../../core/TimeDuration";
import type { Task } from "../../core/types";

type Props = {
  task: Task;
};

export default function TaskSummaryDisplay({ task }: Props) {
  switch (task.status) {
    case "RUNNING":
      return (
        <Alert title="Task in progress">
          <Group gap="xs">
            <Loader type="dots" size="xs" />
            <Text fz="sm">
              Running for{" "}
              <TimeDuration from={task.startTime} to={task.endTime!} />
            </Text>
          </Group>
        </Alert>
      );
    case "SUCCESS":
      return (
        <Alert color="green" title="Task succeeded">
          <Group gap="xs">
            <IconCircleCheckFilled color="var(--mantine-color-green-5)" />
            <Text fz="sm">
              Finished in{" "}
              <TimeDuration from={task.startTime} to={task.endTime!} />
            </Text>
          </Group>
        </Alert>
      );
    case "FAILED":
      return (
        <Alert color="red" title="Task failed">
          <Group gap="xs">
            <IconCircleXFilled color="var(--mantine-color-red-5)" />
            <Text fz="sm">
              Failed after{" "}
              <TimeDuration from={task.startTime} to={task.endTime!} />
            </Text>
          </Group>
        </Alert>
      );
    case "CANCELED":
      return (
        <Alert color="yellow" title="Task canceled">
          <Group gap="xs">
            <IconBan color="var(--mantine-color-yellow-5)" />
            <Text fz="sm">
              Canceled after{" "}
              <TimeDuration from={task.startTime} to={task.endTime!} />
            </Text>
          </Group>
        </Alert>
      );
  }
}
