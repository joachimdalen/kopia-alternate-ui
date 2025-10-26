import { AccordionItem, AccordionPanel, Group, Select } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import useApiRequest from "../../../../core/hooks/useApiRequest";
import kopiaService from "../../../../core/kopiaService";
import type { AlgorithmsList } from "../../../../core/types";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";
type Props = {
  id: string;
  title: string;
  description: string;
  effective?: string;
} & PolicyInput;

export default function PolicyCompressionInput({
  id,
  title,
  description,
  form,
  formKey,
  effective,
}: Props) {
  const inputProps = form.getInputProps(formKey);
  const effectiveValue = inputProps.value || effective;
  const [data, setData] = useState<AlgorithmsList>();
  const { execute } = useApiRequest({
    action: () => kopiaService.getAlgorithms(),
    onReturn(resp) {
      setData(resp);
    },
  });
  useEffect(() => {
    execute();
  }, []);

  const algorithmOptions = useMemo(() => {
    if (data == undefined) return [];
    const grouped = [
      {
        group: "Active",
        items: [
          { label: "None", value: "none" },
          ...data.compression
            .filter((x) => !x.deprecated)
            .map((x) => ({
              label: x.id.replace(/-/g, " "),
              value: x.id,
            })),
        ],
      },
      {
        group: "Deprecated",
        items: data.compression
          .filter((x) => x.deprecated)
          .map((x) => ({
            label: x.id.replace(/-/g, " "),
            value: x.id,
          })),
      },
    ];
    return grouped;
  }, [data]);
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl
        title={title}
        description={description}
        isConfigured={inputProps.value !== undefined}
      />
      <AccordionPanel>
        <Group grow>
          <Select
            label="Defined"
            description="This policy"
            data={algorithmOptions}
            placeholder="Select compression algorithm"
            defaultValue=""
            withCheckIcon={false}
            allowDeselect={false}
            {...inputProps}
          />
          <Select
            description="Defined in global policy"
            label="Effective"
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
