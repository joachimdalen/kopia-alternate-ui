import { t } from "@lingui/core/macro";
import { AccordionItem, AccordionPanel, Group, NumberInput } from "@mantine/core";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  placeholder?: string;
  effective?: number;
} & PolicyInput;

export default function PolicyNumberInput({ id, title, description, placeholder, form, formKey, effective }: Props) {
  const inputProps = form.getInputProps(formKey);
  const effectiveValue = inputProps.value || effective;
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl title={title} description={description} isConfigured={inputProps.value != undefined} />
      <AccordionPanel>
        <Group grow>
          <NumberInput label={t`Defined`} hideControls placeholder={placeholder} {...inputProps} />
          <NumberInput label={t`Effective`} hideControls value={effectiveValue} readOnly />
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
}
