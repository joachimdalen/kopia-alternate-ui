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

export default function FolderActionsTab({ form, resolvedValue }: Props) {
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
          />
          <PolicyNumberInput
            id="before-timeout"
            title={t`Timeout - Before`}
            description={t`Timeout in seconds before Kopia kills the process`}
            form={form}
            formKey="actions.beforeFolder.timeout"
            effective={resolvedValue?.actions?.beforeFolder?.timeout}
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
          />
          <PolicyTextInput
            id="after-folder"
            title={t`After Folder`}
            description={t`Script to run after folder`}
            form={form}
            formKey="actions.afterFolder.script"
            effective={resolvedValue?.actions?.afterFolder?.script}
          />
          <PolicyNumberInput
            id="after-timeout"
            title={t`Timeout - After`}
            description={t`Timeout in seconds before Kopia kills the process`}
            form={form}
            formKey="actions.afterFolder.timeout"
            effective={resolvedValue?.actions?.afterFolder?.timeout}
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
          />
        </Accordion>
      </ScrollAreaAutosize>
    </TabsPanel>
  );
}
