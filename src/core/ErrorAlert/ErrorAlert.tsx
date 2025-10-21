import type { MantineSize, MantineStyleProps } from "@mantine/core";
import { Alert, Group, Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import type { ErrorInformation } from "../hooks/useApiRequest";
import IconWrapper from "../IconWrapper";

type Props = {
  error?: ErrorInformation;
  iconSize?: number;
  size?: MantineSize;
} & Pick<MantineStyleProps, "my" | "mx" | "mt" | "mb">;
export function ErrorAlert({
  error,
  iconSize = 40,
  size = "sm",
  ...rest
}: Props) {
  if (error === null || error === undefined) {
    return null;
  }

  return (
    <Alert
      variant="light"
      color="red"
      bd="2px solid var(--mantine-color-red-5)"
      {...rest}
    >
      <Group>
        <IconWrapper icon={IconAlertTriangle} color="red" size={iconSize} />
        <Stack gap="xs">
          <Text c="var(--mantine-color-red-outline)" fw="bold" fz={size}>
            {error.title}
          </Text>
          {error.message && <Text fz="xs">{error.message}</Text>}
        </Stack>
      </Group>
    </Alert>
  );
}
