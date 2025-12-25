import { t } from "@lingui/core/macro";
import { Accordion, ScrollAreaAutosize, TabsPanel } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import type { Policy } from "../../../../core/types";
import PolicyInheritYesNoPolicyInput from "../policy-inputs/PolicyInheritYesNoPolicyInput";
import type { PolicyForm } from "../types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
  resolvedValue?: Policy;
};

export default function ErrorHandlingTab({ form, resolvedValue }: Props) {
  return (
    <TabsPanel value="error-handling" px="xs">
      <ScrollAreaAutosize mah={600} scrollbarSize={4}>
        <Accordion variant="contained">
          <PolicyInheritYesNoPolicyInput
            id="ignore-dir-errors"
            title={t`Ignore Directory Errors`}
            description={t`Treat directory read errors as non-fatal`}
            form={form}
            formKey="errorHandling.ignoreDirectoryErrors"
            effective={resolvedValue?.errorHandling?.ignoreDirectoryErrors}
          />
          <PolicyInheritYesNoPolicyInput
            id="ignore-file-errors"
            title={t`Ignore File Errors`}
            description={t`Treat file errors as non-fatal`}
            form={form}
            formKey="errorHandling.ignoreFileErrors"
            effective={resolvedValue?.errorHandling?.ignoreFileErrors}
          />
          <PolicyInheritYesNoPolicyInput
            id="ignore-unknown-dir-entries"
            title={t`Ignore Unknown Directory Entries`}
            description={t`Treat unrecognized/unsupported directory entries as non-fatal errors.`}
            form={form}
            formKey="errorHandling.ignoreUnknownTypes"
            effective={resolvedValue?.errorHandling?.ignoreUnknownTypes}
          />
        </Accordion>
      </ScrollAreaAutosize>
    </TabsPanel>
  );
}
