import { AppShellFooter, Group, Text, Tooltip } from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleX,
  IconStopwatch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useServerInstanceContext } from "../context/ServerInstanceContext";
import useApiRequest from "../hooks/useApiRequest";
import { useInterval } from "../hooks/useInterval";
import IconWrapper from "../IconWrapper";
import type { TasksSummary } from "../types";
import { ConnectionInfo } from "./ConnectionInfo";

export function Footer() {
  const { kopiaService } = useServerInstanceContext();
  const [data, setData] = useState<TasksSummary>({
    CANCELED: 0,
    RUNNING: 0,
    SUCCESS: 0,
    FAILED: 0,
  });
  const { execute } = useApiRequest({
    action: () => kopiaService.getTasksSummary(),
    onReturn(resp) {
      setData(resp);
    },
  });
  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useInterval(() => {
    execute();
  }, 1000 * 60);
  return (
    <AppShellFooter p="xs">
      <Group justify="space-between">
        <Group>
          <ConnectionInfo />
        </Group>
        <Group>
          <Tooltip label={`${data.SUCCESS} task(s) completed`}>
            <Group gap={5}>
              <IconWrapper icon={IconCircleCheck} color="green" size={16} />
              <Text fz="sm">{data.SUCCESS}</Text>
            </Group>
          </Tooltip>
          {data.FAILED && (
            <Tooltip label={`${data.FAILED} task(s) failed`}>
              <Group gap={5}>
                <IconWrapper icon={IconCircleX} color="red" size={16} />
                <Text fz="sm">{data.FAILED}</Text>
              </Group>
            </Tooltip>
          )}

          <Tooltip label={`${data.RUNNING} task(s) in progress`}>
            <Group gap={5}>
              <IconWrapper icon={IconStopwatch} color="teal" size={18} />
              <Text fz="sm">{data.RUNNING}</Text>
            </Group>
          </Tooltip>
        </Group>
      </Group>
    </AppShellFooter>
  );
}
