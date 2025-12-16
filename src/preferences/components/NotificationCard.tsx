import {
  ActionIcon,
  Card,
  CardSection,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconBrandPushover,
  IconDots,
  IconMail,
  IconPencil,
  IconTestPipe,
  IconTrash,
  IconWebhook,
} from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type { NotificationProfile } from "../../core/types";
import NotificationSeverityDisplay from "./NotificationSeverityDisplay";

type Props = {
  data: NotificationProfile;
  disabled: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onTest: () => void;
};
function NotificationCard({
  data,
  disabled,
  onDelete,
  onDuplicate,
  onEdit,
  onTest,
}: Props) {
  const getIcon = () => {
    switch (data.method.type) {
      case "webhook":
        return <IconWrapper icon={IconWebhook} color="grape" size={24} />;
      case "email":
        return <IconWrapper icon={IconMail} color="green" size={24} />;
      case "pushover":
        return <IconWrapper icon={IconBrandPushover} color="blue" size={24} />;
    }
  };

  return (
    <Card withBorder radius="xs">
      <CardSection withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Group>
            {getIcon()}
            <Text fw={500}>{data.profile}</Text>
          </Group>
          <Menu
            withinPortal
            position="bottom-end"
            shadow="sm"
            disabled={disabled}
          >
            <MenuTarget>
              <ActionIcon variant="subtle" color="gray" disabled={disabled}>
                <IconDots size={16} />
              </ActionIcon>
            </MenuTarget>

            <MenuDropdown>
              <MenuItem
                leftSection={
                  <IconWrapper icon={IconPencil} color="yellow" size={18} />
                }
                onClick={onEdit}
              >
                Edit
              </MenuItem>
              {/* <MenuItem
                leftSection={
                  <IconWrapper icon={IconCopy} color="blue" size={18} />
                }
                onClick={onDuplicate}
              >
                Duplicate
              </MenuItem> */}
              <MenuItem
                leftSection={
                  <IconWrapper icon={IconTestPipe} color="grape" size={18} />
                }
                onClick={onTest}
              >
                Send test notification
              </MenuItem>
              <MenuItem
                leftSection={
                  <IconWrapper icon={IconTrash} color="red" size={18} />
                }
                color="red"
                onClick={onDelete}
              >
                Delete
              </MenuItem>
            </MenuDropdown>
          </Menu>
        </Group>
      </CardSection>
      <CardSection p="xs">
        <Stack gap="0">
          <Text fw="bold" c="dimmed" fz="xs">
            Minimum Severity
          </Text>
          <NotificationSeverityDisplay severity={data.minSeverity} />
        </Stack>
      </CardSection>
    </Card>
  );
}

export default NotificationCard;
