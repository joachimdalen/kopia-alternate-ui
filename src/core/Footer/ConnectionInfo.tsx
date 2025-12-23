import { Trans } from "@lingui/react/macro";
import {
  ActionIcon,
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
import { IconLockAccessOff } from "@tabler/icons-react";
import { useAppContext } from "../context/AppContext";
import { useServerInstanceContext } from "../context/ServerInstanceContext";
import classes from "./Footer.module.css";

export function ConnectionInfo() {
  const { repoStatus } = useAppContext();
  const { servers, currentServer, setServer, logoutFromServer } =
    useServerInstanceContext();

  return (
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
              <Trans>Server</Trans> :{" "}
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
                  <Trans>Server</Trans> :{" "}
                  <Text fw="bold" fz="xs" span>
                    {currentServer?.name}
                  </Text>
                </Text>
                <Text ml="xs" fz="xs">
                  <Trans>Connected to</Trans> :{" "}
                  <Text fw="bold" fz="xs" span>
                    {repoStatus.description}
                  </Text>
                </Text>
              </Stack>
              {currentServer && (
                <div>
                  <Tooltip label="Logout">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        logoutFromServer(currentServer?.id);
                      }}
                    >
                      <IconLockAccessOff />
                    </ActionIcon>
                  </Tooltip>
                </div>
              )}
            </Group>
          </Paper>
          {servers.length > 1 && (
            <>
              <Divider />
              <Stack px="xs" gap="0">
                <Text c="dimmed" fz="10" mb="5">
                  <Trans>SERVERS</Trans>
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
            </>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
