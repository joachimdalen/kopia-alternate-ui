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

export default function FolderActionsTab({ form, resolvedValue, definition }: Props) {
  const [action, setAction] = useState<string>();
  return (
    <TabsPanel value="folder-actions" px="xs">
      <ScrollAreaAutosize mah={600} scrollbarSize={4}>
        <Accordion variant="contained">
          <PolicyTextInput
            id="before-folder"
            title={t`Before Folder`}
            description={t`Script to run before folder`}
            form={form}
            formKey="actions.beforeFolder.script"
            effective={resolvedValue?.actions?.beforeFolder?.script}
            effectiveDefinedIn={definition?.actions?.beforeFolder}
            rightSection={
              <Tooltip label={t`Open in large edit`}>
                <ActionIcon variant="subtle" color="gray" onClick={() => setAction("actions.beforeFolder.script")}>
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
            formKey="actions.beforeFolder.timeout"
            effective={resolvedValue?.actions?.beforeFolder?.timeout}
            effectiveDefinedIn={definition?.actions?.beforeFolder}
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
            formKey="actions.beforeFolder.mode"
            effectiveDefinedIn={definition?.actions?.beforeFolder}
          />
          <PolicyTextInput
            id="after-folder"
            title={t`After Folder`}
            description={t`Script to run after folder`}
            form={form}
            formKey="actions.afterFolder.script"
            effective={resolvedValue?.actions?.afterFolder?.script}
            effectiveDefinedIn={definition?.actions?.afterFolder}
            rightSection={
              <Tooltip label={t`Open in large edit`}>
                <ActionIcon variant="subtle" color="gray" onClick={() => setAction("actions.afterFolder.script")}>
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
            formKey="actions.afterFolder.timeout"
            effective={resolvedValue?.actions?.afterFolder?.timeout}
            effectiveDefinedIn={definition?.actions?.afterFolder}
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
            formKey="actions.afterFolder.mode"
            effective={resolvedValue?.actions?.afterFolder?.mode}
            effectiveDefinedIn={definition?.actions?.afterFolder}
          />
        </Accordion>
      </ScrollAreaAutosize>
      {action && <PolicyCodeEditModal form={form} formKey={action} onClose={() => setAction(undefined)} />}
    </TabsPanel>
  );
}
