import { t } from "@lingui/core/macro";
import { AccordionItem, AccordionPanel, Group, Select } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useServerInstanceContext } from "../../../../core/context/ServerInstanceContext";
import useApiRequest from "../../../../core/hooks/useApiRequest";
import type { AlgorithmsList } from "../../../../core/types";
import { getEffectiveValue } from "../../../policiesUtil";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  effective?: string;
} & PolicyInput;

export default function PolicyCompressionInput({ id, title, description, form, formKey, effective }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const inputProps = form.getInputProps(formKey);
  const effectiveValue = getEffectiveValue(inputProps.value, effective);
  const [data, setData] = useState<AlgorithmsList>();
  const { execute } = useApiRequest({
    action: () => kopiaService.getAlgorithms(),
    onReturn(resp) {
      setData(resp);
    }
  });
  useEffect(() => {
    execute();
  }, []);

  const algorithmOptions = useMemo(() => {
    if (data == undefined) return [];
    const grouped = [
      {
        group: t`Active`,
        items: [
          { label: t`None`, value: "none" },
          ...data.compression
            .filter((x) => !x.deprecated)
            .map((x) => ({
              label: x.id.replace(/-/g, " "),
              value: x.id
            }))
        ]
      },
      {
        group: t`Deprecated`,
        items: data.compression
          .filter((x) => x.deprecated)
          .map((x) => ({
            label: x.id.replace(/-/g, " "),
            value: x.id
          }))
      }
    ];
    return grouped;
  }, [data]);
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl
        title={title}
        description={description}
        isConfigured={inputProps.value !== undefined && inputProps.value !== "" && inputProps.value !== "none"}
      />
      <AccordionPanel>
        <Group grow>
          <Select
            label={t`Defined`}
            description={t`This policy`}
            data={algorithmOptions}
            placeholder={t`Select compression algorithm`}
            defaultValue=""
            withCheckIcon={false}
            allowDeselect={false}
            {...inputProps}
          />
          <Select
            description={t`Defined in global policy`}
            label={t`Effective`}
            data={algorithmOptions}
            withCheckIcon={false}
            allowDeselect={false}
            readOnly
            value={effectiveValue}
          />
        </Group>
      </AccordionPanel>
    </AccordionItem>
  );
}
