import {
  ActionIcon,
  AppShellFooter,
  Divider,
  Group,
  Indicator,
  Paper,
  Popover,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleX,
  IconLockAccessOff,
  IconStopwatch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useServerInstanceContext } from "../context/ServerInstanceContext";
import useApiRequest from "../hooks/useApiRequest";
import { useInterval } from "../hooks/useInterval";
import IconWrapper from "../IconWrapper";
import type { TasksSummary } from "../types";
import classes from "./Footer.module.css";

export function Footer() {
  const { repoStatus } = useAppContext();
  const { servers, currentServer, setServer, kopiaService } =
    useServerInstanceContext();
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
          <Popover
            position="top"
            clickOutsideEvents={["mouseup", "touchend"]}
            width={300}
          >
            <Popover.Target>
              <UnstyledButton className={classes.serverSelect}>
                <Indicator
                  position="middle-start"
                  processing={repoStatus.connected}
                  color={repoStatus.connected ? "green" : "red"}
                >
                  <Text ml="xs" fz="xs" p="2">
                    Server :{" "}
                    <Text fw="bold" fz="xs" span>
                      {currentServer?.name}
                    </Text>
                  </Text>
                </Indicator>
              </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown p="sm">
              <Stack gap="xs">
                <Paper p="xs" className={classes.current}>
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Text ml="xs" fz="xs">
                        Server :{" "}
                        <Text fw="bold" fz="xs" span>
                          {currentServer?.name}
                        </Text>
                      </Text>
                      <Text ml="xs" fz="xs">
                        Connected to :{" "}
                        <Text fw="bold" fz="xs" span>
                          {repoStatus.description}
                        </Text>
                      </Text>
                    </Stack>
                    <div>
                      <Tooltip label="Logout">
                        <ActionIcon variant="subtle" color="red">
                          <IconLockAccessOff />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                  </Group>
                </Paper>
                <Divider />
                <Stack px="xs" gap="0">
                  <Text c="dimmed" fz="10" mb="5">
                    SERVERS
                  </Text>
                  {servers.map((s) => (
                    <UnstyledButton
                      className={classes.serverButton}
                      fz="xs"
                      key={s.id}
                      disabled={s.id === currentServer?.id}
                      onClick={() => setServer(s)}
                    >
                      {s.name}
                    </UnstyledButton>
                  ))}
                </Stack>
              </Stack>
            </Popover.Dropdown>
          </Popover>
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
