import { Trans } from "@lingui/react/macro";
import { ActionIcon, Divider, Group, Popover, Stack, Text } from "@mantine/core";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import type { SourceInfo } from "../../../../core/types";

type Props = {
  sourceInfo: SourceInfo;
};

export default function PolicyEffectiveLabel({ sourceInfo }: Props) {
  const isGlobal = !sourceInfo.userName && !sourceInfo.host && !sourceInfo.path;
  return (
    <Group gap={2} align="start">
      <Text size="sm" fw={500}>
        <Trans>Effective</Trans>
      </Text>
      <Popover width={400} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <ActionIcon variant="subtle" size="xs" p={0}>
            <IconInfoCircleFilled size={12} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown px="0">
          <Stack gap="xs">
            <Text size="xs" fw="bold" px="sm">
              <Trans>Value defined in policy</Trans>:
            </Text>
            <Divider />
            {isGlobal ? (
              <Text px="xs" fz="sm">
                Global Policy
              </Text>
            ) : (
              <Stack px="xs">
                <Group grow>
                  <Stack gap={0}>
                    <Text fz="xs" fw="bold" c="dimmed" tt="uppercase">
                      <Trans>Username</Trans>
                    </Text>
                    <Text fz="xs">{sourceInfo.userName}</Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text fz="xs" fw="bold" c="dimmed" tt="uppercase">
                      <Trans>Host</Trans>
                    </Text>
                    <Text fz="xs">{sourceInfo.host}</Text>
                  </Stack>
                </Group>
                <Stack gap={0}>
                  <Text fz="xs" fw="bold" c="dimmed" tt="uppercase">
                    <Trans>Path</Trans>
                  </Text>
                  <Text fz="xs">{sourceInfo.path}</Text>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
