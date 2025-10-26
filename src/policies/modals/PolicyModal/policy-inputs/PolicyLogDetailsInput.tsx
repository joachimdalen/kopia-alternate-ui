import { AccordionItem, AccordionPanel, Group } from "@mantine/core";
import NumberSelect from "../../../../core/NumberSelect";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  effective?: number;
} & PolicyInput;
const logDetailsOptions = [
  { label: "Inherit from parent", value: "" },
  { label: "0 - no output", value: "0" },
  { label: "1 - minimal details", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5 - normal details", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10 - maximum details", value: "10" },
];

export default function PolicyLogDetailsInput({
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
          <NumberSelect
            label="Defined"
            description="This policy"
            data={logDetailsOptions}
            withCheckIcon={false}
            defaultIfNotSet=""
            {...inputProps}
          />
          <NumberSelect
            description="Defined in global policy"
            label="Effective"
            data={logDetailsOptions}
            withCheckIcon={false}
            readOnly
            value={effectiveValue}
          />
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
}
