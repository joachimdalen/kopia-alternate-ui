import {
  AccordionItem,
  AccordionPanel,
  Group,
  NumberInput,
} from "@mantine/core";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  placeholder?: string;
} & PolicyInput;

export default function PolicyNumberInput({
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
          <NumberInput
            label="Defined"
            hideControls
            placeholder={placeholder}
            {...inputProps}
          />
          <NumberInput label="Effective" hideControls disabled />
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
}
