import { t } from "@lingui/core/macro";
import { Accordion, ScrollAreaAutosize, TabsPanel } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import type { Policy } from "../../../../core/types";
import PolicyNumberInput from "../policy-inputs/PolicyNumberInput";
import PolicySelect from "../policy-inputs/PolicySelect";
import PolicyTextInput from "../policy-inputs/PolicyTextInput";
import type { PolicyForm } from "../types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
  resolvedValue?: Policy;
};

export default function SnapshotActionsTab({ form, resolvedValue }: Props) {
  return (
    <TabsPanel value="snapshot-actions" px="xs">
      <ScrollAreaAutosize mah={600} scrollbarSize={4}>
        <Accordion variant="contained">
          <PolicyTextInput
            id="before-snapshot"
            title={t`Before Snapshot`}
            description={t`Script to run before snapshot`}
            form={form}
            formKey="actions.beforeSnapshotRoot.script"
            effective={resolvedValue?.actions?.beforeSnapshotRoot?.script}
          />
          <PolicyNumberInput
            id="before-timeout"
            title={t`Timeout - Before`}
            description={t`Timeout in seconds before Kopia kills the process`}
            form={form}
            formKey="actions.beforeSnapshotRoot.timeout"
            effective={resolvedValue?.actions?.beforeSnapshotRoot?.timeout}
          />
          <PolicySelect
            id="before-command-mode"
            title={t`Command Mode - Before`}
            description={t`Essential (must succeed; default behavior), optional (failures are tolerated), or async (Kopia will start the action but not wait for it to finish)`}
            data={[
              { label: t`Must Succeed`, value: "essential" },
              { label: t`Ignore failures`, value: "optional" },
              {
                label: t`Run asynchronously, ignore failures`,
                value: "async"
              }
            ]}
            form={form}
            formKey="actions.beforeSnapshotRoot.mode"
          />
          <PolicyTextInput
            id="after-snapshot"
            title={t`After Snapshot`}
            description={t`Script to run after snapshot`}
            form={form}
            formKey="actions.afterSnapshotRoot.script"
            effective={resolvedValue?.actions?.afterSnapshotRoot?.script}
          />
          <PolicyNumberInput
            id="after-timeout"
            title={t`Timeout - After`}
            description={t`Timeout in seconds before Kopia kills the process`}
            form={form}
            formKey="actions.afterSnapshotRoot.timeout"
            effective={resolvedValue?.actions?.afterSnapshotRoot?.timeout}
          />
          <PolicySelect
            id="after-command-mode"
            title={t`Command Mode - After`}
            description={t`Essential (must succeed; default behavior), optional (failures are tolerated), or async (Kopia will start the action but not wait for it to finish)`}
            data={[
              { label: t`Must Succeed`, value: "essential" },
              { label: t`Ignore failures`, value: "optional" },
              {
                label: t`Run asynchronously, ignore failures`,
                value: "async"
              }
            ]}
            form={form}
            formKey="actions.afterSnapshotRoot.mode"
          />
        </Accordion>
      </ScrollAreaAutosize>
    </TabsPanel>
  );
}
