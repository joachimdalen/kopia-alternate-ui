import { Group, Text } from "@mantine/core";

import { IconClockCheck, IconDatabase, IconDatabaseCog, IconRestore, IconTool } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
type Props = {
  kind: string;
};

export default function TaskKindDisplay({ kind }: Props) {
  switch (kind) {
    case "Restore":
      return (
        <Group gap="xs">
          <IconWrapper icon={IconRestore} size={16} color="grape" />
          <Text fz="sm">Restore</Text>
        </Group>
      );
    case "Snapshot":
      return (
        <Group gap="xs">
          <IconWrapper icon={IconDatabaseCog} size={16} color="green" />
          <Text fz="sm">Snapshot</Text>
        </Group>
      );
    case "Maintenance":
      return (
        <Group gap="xs">
          <IconWrapper icon={IconTool} size={16} color="yellow" />
          <Text fz="sm">Maintenance</Text>
        </Group>
      );
    case "Repository":
      return (
        <Group gap="xs">
          <IconWrapper icon={IconDatabase} size={16} color="blue" />
          <Text fz="sm">Repository</Text>
        </Group>
      );
    case "Estimate":
      return (
        <Group gap="xs">
          <IconWrapper icon={IconClockCheck} size={16} color="teal" />
          <Text fz="sm">Estimate</Text>
        </Group>
      );
    default:
      return kind;
  }
}
