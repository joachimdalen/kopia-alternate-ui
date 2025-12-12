import { Anchor, AppShellFooter, Group, Text, Tooltip } from "@mantine/core";
import {
  IconBrandGithub,
  IconCircleCheck,
  IconStopwatch,
} from "@tabler/icons-react";
import { useState } from "react";
import useApiRequest from "../hooks/useApiRequest";
import { useInterval } from "../hooks/useInterval";
import IconWrapper from "../IconWrapper";
import kopiaService from "../kopiaService";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import type { TasksSummary } from "../types";

export function Footer() {
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
  useInterval(() => {
    execute();
  }, 1000 * 60);
  return (
    <AppShellFooter p="xs">
      <Group justify="space-between">
        <Group>
          <ThemeToggle />
          <Group>
            <Anchor href="" target="_blank" fz="sm">
              <Group gap={5}>
                <IconWrapper icon={IconBrandGithub} size={16} />
                <Text fz="sm">Kopia Alternative UI</Text>
              </Group>
            </Anchor>
          </Group>
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
