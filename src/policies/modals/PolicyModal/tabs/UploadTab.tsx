import { t } from "@lingui/core/macro";
import { Accordion, ScrollAreaAutosize, TabsPanel } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import type { Policy } from "../../../../core/types";
import PolicyNumberInput from "../policy-inputs/PolicyNumberInput";
import type { PolicyForm } from "../types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
  resolvedValue?: Policy;
};

export default function UploadTab({ form, resolvedValue }: Props) {
  return (
    <TabsPanel value="upload" px="xs">
      <ScrollAreaAutosize mah={600} scrollbarSize={4}>
        <Accordion variant="contained">
          <PolicyNumberInput
            id="maximum-parallel-snapshots"
            title={t`Maximum Parallel Snapshots`}
            description={t`Maximum number of snapshots that can be uploaded simultaneously`}
            placeholder={t`must be specified using global, user, or host policy`}
            form={form}
            formKey="upload.maxParallelSnapshots"
            effective={resolvedValue?.upload?.maxParallelSnapshots}
          />
          <PolicyNumberInput
            id="maximum-parallel-file-reads"
            title={t`Maximum Parallel File Reads`}
            description={t`Maximum number of files that will be read in parallel (defaults to the number of logical processors)`}
            placeholder={t`max number of parallel file reads`}
            form={form}
            formKey="upload.maxParallelFileReads"
            effective={resolvedValue?.upload?.maxParallelFileReads}
          />
        </Accordion>
      </ScrollAreaAutosize>
    </TabsPanel>
  );
}
