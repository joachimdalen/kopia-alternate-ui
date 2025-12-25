import { Menu, MenuDivider, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import classes from "./MenuButton.module.css";

export function MenuButton({
  options,
  onClick,
  disabled,
  prefix
}: {
  options: { label: string | React.ReactNode; value: string }[];
  onClick: (selected: string) => void;
  disabled?: boolean;
  prefix?: string;
}) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const items = options.map((item, index) =>
    item.value === "divider" ? (
      <MenuDivider key={`divider-${index}`} />
    ) : (
      <Menu.Item
        onClick={() => {
          setSelected(item);
          onClick(item.value);
        }}
        key={item.value}
      >
        {item.label}
      </Menu.Item>
    )
  );

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
      disabled={disabled}
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined} size="xs">
          <span className={classes.label}>{prefix === undefined ? selected.label : `${prefix} ${selected.label}`}</span>
          <IconChevronDown size={16} className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
