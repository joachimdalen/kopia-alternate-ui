import type { ButtonProps } from "@mantine/core";
import { IconPlus, IconRefresh } from "@tabler/icons-react";

export const refreshButtonProps: ButtonProps = {
  size: "xs",
  color: "blue",
  variant: "outline",
  leftSection: <IconRefresh size={16} />,
};
export const newActionProps: ButtonProps = {
  size: "xs",
  color: "green",
  leftSection: <IconPlus size={16} />,
};
