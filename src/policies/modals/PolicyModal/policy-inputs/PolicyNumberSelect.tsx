import {
  AccordionItem,
  AccordionPanel,
  Group,
  type ComboboxData,
} from "@mantine/core";
import NumberSelect from "../../../../core/NumberSelect";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  placeholder?: string;
  effective?: string;
  data: ComboboxData;
} & PolicyInput;

export default function PolicyNumberSelect({
  id,
  title,
  description,
  placeholder,
  form,
  formKey,
  effective,
  data,
}: Props) {
  const inputProps = form.getInputProps(formKey);
  const effectiveValue = inputProps.value || effective;

  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl
        title={title}
        description={description}
        isConfigured={inputProps.value != undefined}
      />
      <AccordionPanel>
        <Group grow>
          <NumberSelect
            label="Defined"
            description="This policy"
            placeholder={placeholder}
            data={data}
            withCheckIcon={false}
            {...inputProps}
          />
          <NumberSelect
            description="Defined in global policy"
            label="Effective"
            data={data}
            withCheckIcon={false}
            disabled
            value={effectiveValue}
          />
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
}
