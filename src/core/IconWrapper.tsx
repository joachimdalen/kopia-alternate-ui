import { type MantineColor, Tooltip } from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";

export default function IconWrapper({
  icon: Icon,
  size = 14,
  color,
  tooltip,
}: {
  icon: typeof IconHome2;
  color?: MantineColor;
  size?: number;
  tooltip?: string;
}) {
  const icn = (
    <Icon
      height={size}
      width={size}
      color={color && `var(--mantine-color-${color}-5)`}
      stroke={2}
    />
  );
  if (tooltip) return <Tooltip label={tooltip}>{icn}</Tooltip>;
  return icn;
}
