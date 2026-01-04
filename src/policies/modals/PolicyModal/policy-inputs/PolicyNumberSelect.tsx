import { t } from "@lingui/core/macro";
import { AccordionItem, AccordionPanel, type ComboboxData, Group } from "@mantine/core";
import NumberSelect from "../../../../core/NumberSelect";
import { getEffectiveValue } from "../../../policiesUtil";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import PolicyEffectiveLabel from "../components/PolicyEffectiveLabel";
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
  effectiveDefinedIn
}: Props) {
  const inputProps = form.getInputProps(formKey);
  const effectiveValue = getEffectiveValue(inputProps.value, effective);
  const isDefined = inputProps.value || effective;
  console.log(formKey, effectiveDefinedIn);
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl
        title={title}
        description={description}
        isConfigured={inputProps.value !== undefined && inputProps.value !== ""}
      />
      <AccordionPanel>
        <Group grow align="flex-start">
          <NumberSelect
            label={t`Defined`}
            placeholder={placeholder}
            data={data}
            withCheckIcon={false}
            {...inputProps}
          />
          <NumberSelect
            label={
              effectiveDefinedIn && isDefined ? <PolicyEffectiveLabel sourceInfo={effectiveDefinedIn} /> : t`Effective`
            }
            data={data}
            withCheckIcon={false}
            disabled
            value={effectiveValue}
            variant="filled"
          />
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
}
