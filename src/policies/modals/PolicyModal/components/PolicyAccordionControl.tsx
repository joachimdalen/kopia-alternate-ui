import { AccordionControl, Group, Stack, Text } from "@mantine/core";
import { IconBan, IconCircleCheckFilled } from "@tabler/icons-react";
import IconWrapper from "../../../../core/IconWrapper";

type Props = {
  title: string;
  description: string;
  isConfigured: boolean;
};

export default function PolicyAccordionControl({
  title,
  description,
  isConfigured,
}: Props) {
  return (
    <AccordionControl>
      <Stack gap={0}>
        <Group grow>
          <Text fz="sm">{title}</Text>
          {isConfigured ? (
            <Group gap={2} justify="end" mr="md">
              <IconWrapper
                icon={IconCircleCheckFilled}
                color="green"
                size={18}
              />
              <Text fz="xs" c="green">
                Configured
              </Text>
            </Group>
          ) : (
            <Group gap={2} justify="end" mr="md">
              <IconWrapper icon={IconBan} color="gray" size={18} />
              <Text fz="xs" c="gray">
                Not configured
              </Text>
            </Group>
          )}
        </Group>
        <Text fz="xs" c="dimmed">
          {description}
        </Text>
      </Stack>
    </AccordionControl>
  );
}
