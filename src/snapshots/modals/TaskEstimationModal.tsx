import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Stack,
} from "@mantine/core";
import { LazyLog } from "@melloware/react-logviewer";
import { useEffect, useState } from "react";
import { ErrorAlert } from "../../core/ErrorAlert/ErrorAlert";
import { formatTimestamp } from "../../core/formatTimestamp";
import useApiRequest from "../../core/hooks/useApiRequest";
import { useInterval } from "../../core/hooks/useInterval";
import kopiaService from "../../core/kopiaService";
import {
  type EstimateSnapshotRequest,
  type Policy,
  type SourceInfo,
  type Task,
} from "../../core/types";
import modalClasses from "../../styles/modals.module.css";
import modalBaseStyles from "../../styles/modalStyles";
import TaskCounterGrid from "../../tasks/components/TaskCounterGrid";
import TaskStatusDisplay from "../../tasks/components/TaskStatusDisplay";

type Props = {
  policy: Policy;
  source: SourceInfo;
  onCancel: () => void;
};

export default function TaskEstimationModal({
  policy,
  source,
  onCancel,
}: Props) {
  const [task, setTask] = useState<Task>();
  const [logs, setLogs] = useState<
    {
      level: number;
      ts: number;
      msg: string;
      mod: string;
    }[]
  >([]);
  const estimateAction = useApiRequest({
    action: (data?: EstimateSnapshotRequest) =>
      kopiaService.estimateSnapshot(data!),
    onReturn: (t) => {
      setTask(t);
    },
  });
  const loadTaskAction = useApiRequest({
    action: (data?: string) => kopiaService.getTask(data!),
    onReturn: (t) => {
      setTask(t);
    },
  });
  const loadTaskLogsAction = useApiRequest({
    action: (data?: string) => kopiaService.getTaskLogs(data!),
    onReturn: (t) => {
      setLogs(t.logs);
    },
  });

  // TODO: move hook locally
  useInterval(() => {
    if (task !== undefined && task.endTime === undefined) {
      loadTaskAction.execute(task.id);
      loadTaskLogsAction.execute(task.id);
    }
  }, 3000);

  useEffect(() => {
    const req: EstimateSnapshotRequest = {
      root: source.path,
      maxExamplesPerBucket: 10,
      policyOverride: policy,
    };
    estimateAction.execute(req);
  }, []);

  return (
    <Modal
      title="Estimate snapshot"
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="lg"
    >
      <Stack w="100%" className={modalClasses.container}>
        <ErrorAlert
          error={
            estimateAction.error ||
            loadTaskAction.error ||
            loadTaskLogsAction.error
          }
        />
        <LoadingOverlay visible={estimateAction.loading} />
        {task && (
          <>
            <TaskStatusDisplay task={task} />
            {task.counters !== null && (
              <TaskCounterGrid
                task={task}
                showZeroCounters={false}
                gridSize={3}
              />
            )}
            {logs.length > 0 && (
              <Paper withBorder>
                <LazyLog
                  extraLines={1}
                  height="250"
                  wrapLines
                  text={logs
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
              </Paper>
            )}
          </>
        )}
      </Stack>

      <Group className={modalClasses.footer}>
        <Button
          size="xs"
          color="gray"
          variant="subtle"
          onClick={onCancel}
          disabled={estimateAction.loading}
        >
          Cancel
        </Button>

        <Button size="xs" onClick={onCancel} disabled={estimateAction.loading}>
          Close
        </Button>
      </Group>
    </Modal>
  );
}
