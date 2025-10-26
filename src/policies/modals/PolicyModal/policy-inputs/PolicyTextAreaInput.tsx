import {
  AccordionItem,
  AccordionPanel,
  Group,
  Stack,
  Textarea,
} from "@mantine/core";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  placeholder?: string;
  children?: React.ReactElement;
} & PolicyInput;

export default function PolicyTextAreaInput({
  id,
  title,
  description,
  placeholder,
  children,
  form,
  formKey,
}: Props) {
  const inputProps = form.getInputProps(formKey);
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl
        title={title}
        description={description}
        isConfigured={inputProps.value !== undefined}
      />
      <AccordionPanel>
        <Stack>
          <Group grow>
            <Textarea
              label="Defined"
              placeholder={placeholder}
              {...inputProps}
            />
            <Textarea label="Effective" disabled />
          </Group>
          {children}
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}
