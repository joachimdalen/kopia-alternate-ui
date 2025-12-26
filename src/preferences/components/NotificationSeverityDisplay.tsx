import { Group, Text } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconInfoCircle,
  IconSearch
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
          <IconWrapper icon={IconInfoCircle} color="gray" size={18} />
          <Text>Verbose</Text>
        </Group>
      );
    case -10:
      return (
        <Group gap="xs">
          <IconWrapper icon={IconCircleCheckFilled} color="green" size={18} />
          <Text>Success</Text>
        </Group>
      );
    case 0:
      return (
        <Group gap="xs">
          <IconWrapper icon={IconSearch} color="grape" size={18} />
          <Text>Report</Text>
        </Group>
      );
    case 10:
      return (
        <Group gap="xs">
          <IconWrapper icon={IconAlertTriangle} color="yellow" size={18} />
          <Text>Warning</Text>
        </Group>
      );
    case 20:
      return (
        <Group gap="xs">
          <IconWrapper icon={IconCircleXFilled} color="red" size={18} />
          <Text>Error</Text>
        </Group>
      );
  }
}
