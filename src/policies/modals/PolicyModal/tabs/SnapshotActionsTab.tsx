import { t } from "@lingui/core/macro";
import { Accordion, ActionIcon, ScrollAreaAutosize, TabsPanel, Tooltip } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import { IconPencilCode } from "@tabler/icons-react";
import { useState } from "react";
import type { Policy, PolicyDefinition } from "../../../../core/types";
import PolicyCodeEditModal from "../../PolicyCodeEditModal/PolicyCodeEditModal";
import PolicyNumberInput from "../policy-inputs/PolicyNumberInput";
import PolicySelect from "../policy-inputs/PolicySelect";
import PolicyTextInput from "../policy-inputs/PolicyTextInput";
import type { PolicyForm } from "../types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
  resolvedValue?: Policy;
  definition?: PolicyDefinition;
};

export default function SnapshotActionsTab({ form, resolvedValue, definition }: Props) {
  const [action, setAction] = useState<string>();
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
            effectiveDefinedIn={definition?.actions?.beforeSnapshotRoot}
            rightSection={
              <Tooltip label={t`Open in large edit`}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => setAction("actions.beforeSnapshotRoot.script")}
                >
                  <IconPencilCode size={16} />
                </ActionIcon>
              </Tooltip>
            }
          />
          <PolicyNumberInput
            id="before-timeout"
            title={t`Timeout - Before`}
            description={t`Timeout in seconds before Kopia kills the process`}
            form={form}
            formKey="actions.beforeSnapshotRoot.timeout"
            effective={resolvedValue?.actions?.beforeSnapshotRoot?.timeout}
            effectiveDefinedIn={definition?.actions?.beforeSnapshotRoot}
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
            effective={resolvedValue?.actions?.beforeSnapshotRoot?.mode}
            effectiveDefinedIn={definition?.actions?.beforeSnapshotRoot}
          />
          <PolicyTextInput
            id="after-snapshot"
            title={t`After Snapshot`}
            description={t`Script to run after snapshot`}
            form={form}
            formKey="actions.afterSnapshotRoot.script"
            effective={resolvedValue?.actions?.afterSnapshotRoot?.script}
            effectiveDefinedIn={definition?.actions?.beforeSnapshotRoot}
            rightSection={
              <Tooltip label={t`Open in large edit`}>
                <ActionIcon variant="subtle" color="gray" onClick={() => setAction("actions.afterSnapshotRoot.script")}>
                  <IconPencilCode size={16} />
                </ActionIcon>
              </Tooltip>
            }
          />
          <PolicyNumberInput
            id="after-timeout"
            title={t`Timeout - After`}
            description={t`Timeout in seconds before Kopia kills the process`}
            form={form}
            formKey="actions.afterSnapshotRoot.timeout"
            effective={resolvedValue?.actions?.afterSnapshotRoot?.timeout}
            effectiveDefinedIn={definition?.actions?.afterSnapshotRoot}
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
            effective={resolvedValue?.actions?.afterSnapshotRoot?.mode}
            effectiveDefinedIn={definition?.actions?.afterSnapshotRoot}
          />
        </Accordion>
      </ScrollAreaAutosize>
      {action && <PolicyCodeEditModal form={form} formKey={action} onClose={() => setAction(undefined)} />}
    </TabsPanel>
  );
}
