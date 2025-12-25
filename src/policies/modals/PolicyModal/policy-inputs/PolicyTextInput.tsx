import { t } from "@lingui/core/macro";
import { AccordionItem, AccordionPanel, Group, TextInput } from "@mantine/core";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  placeholder?: string;
  effective?: string;
} & PolicyInput;

export default function PolicyTextInput({ id, title, description, placeholder, form, formKey, effective }: Props) {
  const inputProps = form.getInputProps(formKey);
  const effectiveValue = inputProps.value || effective;
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl title={title} description={description} isConfigured={inputProps.value != undefined} />
      <AccordionPanel>
        <Group grow>
          <TextInput label={t`Defined`} placeholder={placeholder} {...inputProps} />
          <TextInput label={t`Effective`} readOnly value={effectiveValue} />
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
}
