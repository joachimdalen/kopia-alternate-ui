import { t } from "@lingui/core/macro";
import { AppShellFooter, Group, Text, Tooltip } from "@mantine/core";
import { IconCircleCheck, IconCircleX, IconStopwatch } from "@tabler/icons-react";
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
    FAILED: 0
  });
  const { execute } = useApiRequest({
    action: () => kopiaService.getTasksSummary(),
    onReturn(resp) {
      setData(resp);
    }
  });
  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useInterval(() => {
    execute();
  }, 1000 * 60);

  const successTaskCount = data.SUCCESS;
  const failedTaskCount = data.FAILED;
  const inProgressTaskCount = data.RUNNING;

  return (
    <AppShellFooter p="xs">
      <Group justify="space-between">
        <Group>
          <ConnectionInfo />
        </Group>
        <Group>
          <Tooltip label={t`${successTaskCount} task(s) completed`}>
            <Group gap={5}>
              <IconWrapper icon={IconCircleCheck} color="green" size={16} />
              <Text fz="sm">{successTaskCount}</Text>
            </Group>
          </Tooltip>
          {data.FAILED && (
            <Tooltip label={t`${failedTaskCount} task(s) failed`}>
              <Group gap={5}>
                <IconWrapper icon={IconCircleX} color="red" size={16} />
                <Text fz="sm">{failedTaskCount}</Text>
              </Group>
            </Tooltip>
          )}
          <Tooltip label={t`${inProgressTaskCount} task(s) in progress`}>
            <Group gap={5}>
              <IconWrapper icon={IconStopwatch} color="teal" size={18} />
              <Text fz="sm">{inProgressTaskCount}</Text>
            </Group>
          </Tooltip>
        </Group>
      </Group>
    </AppShellFooter>
  );
}
