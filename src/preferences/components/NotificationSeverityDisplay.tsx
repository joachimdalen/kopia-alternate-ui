import { Group, Text } from "@mantine/core";

import {
  IconAlertTriangle,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconFile,
  IconFileCode,
} from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
type Props = {
  severity: number;
};

export default function NotificationSeverityDisplay({ severity }: Props) {
  switch (severity) {
    case -100:
      return (
        <Group gap="xs">
          <IconWrapper icon={IconFileCode} color="gray" size={18} />
          <Text c="red">Verbose</Text>
        </Group>
      );
    case -10:
      return (
        <Group gap="xs">
          <IconWrapper icon={IconCircleCheckFilled} color="green" size={18} />
          <Text c="red">Success</Text>
        </Group>
      );
    case 0:
      return (
        <Group gap="xs">
          <IconWrapper icon={IconFile} color="grape" size={18} />
          <Text c="red">Report</Text>
        </Group>
      );
    case 10:
      return (
        <Group gap="xs">
          <IconWrapper icon={IconAlertTriangle} color="yellow" size={18} />
          <Text c="red">Warning</Text>
        </Group>
      );
    case 20:
      return (
        <Group gap="xs">
          <IconWrapper icon={IconCircleXFilled} color="red" size={18} />
          <Text c="red">Error</Text>
        </Group>
      );
  }
}
