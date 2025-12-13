import {
  ActionIcon,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconClockPlay,
  IconClockStop,
  IconStopwatch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import kopiaService from "../core/kopiaService";
import TimeDuration from "../core/TimeDuration";
import type { Task } from "../core/types";
import TaskCounterGrid from "./components/TaskCounterGrid";
import TaskLogs from "./components/TaskLogs";
import TaskSummaryDisplay from "./components/TaskSummaryDisplay";

function TaskDetailsPage() {
  const { tid } = useParams();
  const [data, setData] = useState<Task>();
  const taskApi = useApiRequest({
    action: () => kopiaService.getTask(tid || ""),
    onReturn(resp) {
      setData(resp);
    },
  });

  useEffect(() => {
    taskApi.execute(undefined, "loading");
  }, []);

  return (
    <Container fluid>
      <Stack>
        <Group>
          <ActionIcon variant="subtle" component={Link} to="/tasks">
            <IconArrowLeft size={24} />
          </ActionIcon>
          <Title order={1}>
            {data?.kind}: {data?.description}
          </Title>
        </Group>
        <ErrorAlert error={taskApi.error} />
        {data && <TaskSummaryDisplay task={data} />}
        <Group grow>
          <Paper withBorder radius="md" p="xs">
            <Group>
              <IconWrapper icon={IconClockPlay} size={32} color="green" />
              <div>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                  Started
                </Text>
                <Text fw={700} size="xl">
                  {data?.startTime
                    ? new Date(data.startTime).toLocaleString()
                    : ""}
                </Text>
              </div>
            </Group>
          </Paper>
          <Paper withBorder radius="md" p="xs">
            <Group>
              <IconWrapper icon={IconClockStop} size={32} color="blue" />
              <div>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                  Finished
                </Text>
                <Text fw={700} size="xl">
                  {data?.endTime
                    ? new Date(data?.endTime).toLocaleString()
                    : ""}
                </Text>
              </div>
            </Group>
          </Paper>
          <Paper withBorder radius="md" p="xs">
            <Group>
              <IconWrapper icon={IconStopwatch} size={32} color="teal" />

              <div>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                  Duration
                </Text>
                <Text fw={700} size="xl">
                  {data?.startTime && data.endTime && (
                    <TimeDuration from={data.startTime} to={data.endTime!} />
                  )}
                </Text>
              </div>
            </Group>
          </Paper>
        </Group>
        <Divider />
        {data && data.counters != null && (
          <TaskCounterGrid task={data} showZeroCounters={false} />
        )}
        {data && <TaskLogs task={data} />}
      </Stack>
    </Container>
  );
}

export default TaskDetailsPage;
