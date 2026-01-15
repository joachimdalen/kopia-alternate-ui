import { ActionIcon, Button, Group, Menu } from "@mantine/core";
import { IconCalendar, IconChevronDown } from "@tabler/icons-react";

import classes from "./RunMaintenanceButton.module.css";

export default function RunMaintenanceButton() {
  return (
    <Group wrap="nowrap" gap={0}>
      <Button className={classes.button} size="xs">
        Run maintenance
      </Button>
      <Menu transitionProps={{ transition: "pop" }} position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon variant="filled" size={30} className={classes.menuControl}>
            <IconChevronDown size={16} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconCalendar size={16} stroke={1.5} />}>Run full maintenance</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
