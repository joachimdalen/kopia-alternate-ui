import { AccordionItem, AccordionPanel, Group, TextInput } from "@mantine/core";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  placeholder?: string;
} & PolicyInput;

export default function PolicyTextInput({
  id,
  title,
  description,
  placeholder,
  form,
  formKey,
}: Props) {
  const inputProps = form.getInputProps(formKey);
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl
        title={title}
        description={description}
        isConfigured={inputProps.value != undefined}
      />
      <AccordionPanel>
        <Group grow>
          <TextInput
            label="Defined"
            placeholder={placeholder}
            {...inputProps}
          />
          <TextInput label="Effective" disabled />
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
}
