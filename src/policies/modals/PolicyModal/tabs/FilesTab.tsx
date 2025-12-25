import { t } from "@lingui/core/macro";
import { Accordion, Anchor, ScrollAreaAutosize, Switch, TabsPanel, Text } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import type { Policy } from "../../../../core/types";
import PolicyInheritYesNoPolicyInput from "../policy-inputs/PolicyInheritYesNoPolicyInput";
import PolicyNumberInput from "../policy-inputs/PolicyNumberInput";
import PolicyTextListInput from "../policy-inputs/PolicyTextListInput";
import type { PolicyForm } from "../types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
  resolvedValue?: Policy;
};

export default function FilesTab({ form, resolvedValue }: Props) {
  return (
    <TabsPanel value="files" px="xs">
      <ScrollAreaAutosize mah={600} scrollbarSize={4}>
        <Accordion variant="contained">
          <PolicyTextListInput
            id="ignore-files"
            title={t`Ignore Files`}
            description={t`List of file and directory names to ignore.`}
            form={form}
            formKey="files.ignore"
            placeholder="e.g. /file.txt"
            infoNode={
              <Text fz="xs">
                See{" "}
                <Anchor fz="xs" href="https://kopia.io/docs/advanced/kopiaignore/" target="_blank">
                  documentation on ignoring files.
                </Anchor>
              </Text>
            }
            effective={resolvedValue?.files?.ignore}
          >
            <Switch
              label={t`Ignore Rules From Parent Directories`}
              description={t`When set, ignore rules from the parent directory are ignored`}
              {...form.getInputProps("files.noParentIgnore", {
                type: "checkbox"
              })}
            />
          </PolicyTextListInput>
          <PolicyTextListInput
            id="ignore-rule-files"
            title={t`Ignore Rule Files`}
            description={t`List of additional files containing ignore rules (each file configures ignore rules for the directory and its subdirectories)`}
            form={form}
            formKey="files.ignoreDotFiles"
            effective={resolvedValue?.files?.ignoreDotFiles}
          >
            <Switch
              label={t`Ignore Rule Files From Parent Directories`}
              description={t`When set, the files specifying ignore rules (.kopiaignore, etc.) from the parent directory are ignored`}
              {...form.getInputProps("files.noParentDotFiles")}
            />
          </PolicyTextListInput>

          <PolicyInheritYesNoPolicyInput
            id="ignore-well-known-cache-dirs"
            title={t`Ignore Well-Known Cache Directories`}
            description={t`Ignore directories containing CACHEDIR.TAG and similar`}
            form={form}
            formKey="files.ignoreCacheDirs"
            effective={resolvedValue?.files?.ignoreCacheDirs}
          />

          <PolicyNumberInput
            id="ignore-files-larger-than"
            title={t`Ignore Files larger than`}
            description={t`When set, the files larger than the specified size are ignored (specified in bytes)`}
            form={form}
            formKey="files.maxFileSize"
            effective={resolvedValue?.files?.maxFileSize}
          />
          <PolicyInheritYesNoPolicyInput
            id="scan-only-one-fs"
            title={t`Scan only one filesystem`}
            description={t`Do not cross filesystem boundaries when creating a snapshot`}
            form={form}
            formKey="files.oneFileSystem"
            effective={resolvedValue?.files?.oneFileSystem}
          />
        </Accordion>
      </ScrollAreaAutosize>
    </TabsPanel>
  );
}
