import { t } from "@lingui/core/macro";
import { AccordionItem, AccordionPanel, Group, TextInput } from "@mantine/core";
import { getEffectiveValue } from "../../../policiesUtil";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  placeholder?: string;
  effective?: string;
  rightSection?: React.ReactNode;
} & PolicyInput;

export default function PolicyTextInput({
  id,
  title,
  description,
  placeholder,
  form,
  formKey,
  effective,
  rightSection
}: Props) {
  const inputProps = form.getInputProps(formKey);
  const effectiveValue = getEffectiveValue(inputProps.value, effective);
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl
        title={title}
        description={description}
        isConfigured={inputProps.value !== undefined && inputProps.value !== ""}
      />
      <AccordionPanel>
        <Group grow align="flex-start">
          <TextInput label={t`Defined`} placeholder={placeholder} rightSection={rightSection} {...inputProps} />
          <TextInput label={t`Effective`} readOnly value={effectiveValue} variant="filled" />
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
}
