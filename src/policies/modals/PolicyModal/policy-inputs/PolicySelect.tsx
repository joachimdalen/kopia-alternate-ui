import { t } from "@lingui/core/macro";
import { AccordionItem, AccordionPanel, type ComboboxData, Group, Select } from "@mantine/core";
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

export default function PolicySelect({
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
  const isConfigured = inputProps.value !== undefined && inputProps.value !== "";
  const isDefined = inputProps.value || effective;
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl title={title} description={description} isConfigured={isConfigured} />
      <AccordionPanel>
        <Group grow align="flex-start">
          <Select label={t`Defined`} placeholder={placeholder} data={data} withCheckIcon={false} {...inputProps} />
          <Select
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
