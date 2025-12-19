import { AppShellFooter, Group, Indicator, Text, Tooltip } from "@mantine/core";
import { IconCircleCheck, IconStopwatch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import useApiRequest from "../hooks/useApiRequest";
import { useInterval } from "../hooks/useInterval";
import IconWrapper from "../IconWrapper";
import kopiaService from "../kopiaService";
import type { TasksSummary } from "../types";

export function Footer() {
  const { repoStatus } = useAppContext();
  const [data, setData] = useState<TasksSummary>({
    CANCELED: 0,
    RUNNING: 0,
    SUCCESS: 0,
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
          <Indicator
            position="middle-start"
            processing={repoStatus.connected}
            color={repoStatus.connected ? "green" : "red"}
          >
            {repoStatus.connected ? (
              <Text ml="xs" fz="xs">
                Connected to:{" "}
                <Text fw="bold" fz="xs" span>
                  {repoStatus.description}
                </Text>
              </Text>
            ) : (
              <Text ml="xs" fz="xs">
                Disconnected
              </Text>
            )}
          </Indicator>
        </Group>
        <Group>
          <Tooltip label={`${data.SUCCESS} task(s) completed`}>
            <Group gap={5}>
              <IconWrapper icon={IconCircleCheck} color="green" size={16} />
              <Text fz="sm">{data.SUCCESS}</Text>
            </Group>
          </Tooltip>

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
