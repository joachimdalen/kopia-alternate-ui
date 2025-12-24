import { Trans } from "@lingui/react/macro";
import { AccordionItem, AccordionPanel, Box, Group, Text } from "@mantine/core";
import InheritYesNoPolicyControl from "../components/InheritYesNoPolicyControl";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  effective?: boolean;
} & PolicyInput;

export default function PolicyInheritYesNoPolicyInput({
  id,
  title,
  description,
  form,
  formKey,
  effective,
}: Props) {
  const inputProps = form.getInputProps(formKey);
  const effectiveValue = inputProps.value || effective;
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl
        title={title}
        description={description}
        isConfigured={inputProps.value !== undefined}
      />
      <AccordionPanel>
        <Group grow>
          <Box>
            <Text size="sm" fw={500}>
              <Trans>Defined</Trans>
            </Text>
            <InheritYesNoPolicyControl {...inputProps} />
          </Box>
          <Box>
            <Text size="sm" fw={500}>
              <Trans>Effective</Trans>
            </Text>
            <InheritYesNoPolicyControl value={effectiveValue} disabled />
          </Box>
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
}
