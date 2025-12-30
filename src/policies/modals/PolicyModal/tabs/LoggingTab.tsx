import { t } from "@lingui/core/macro";
import { Accordion, ScrollAreaAutosize, TabsPanel } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import type { Policy } from "../../../../core/types";
import PolicyLogDetailsInput from "../policy-inputs/PolicyLogDetailsInput";
import type { PolicyForm } from "../types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
  resolvedValue?: Policy;
};

export default function LoggingTab({ form, resolvedValue }: Props) {
  return (
    <TabsPanel value="logging" px="xs">
      <ScrollAreaAutosize mah={600} scrollbarSize={4}>
        <Accordion variant="contained">
          <PolicyLogDetailsInput
            id="directory-snapshotted"
            title={t`Directory Snapshotted`}
            description={t`Log verbosity when a directory is snapshotted`}
            form={form}
            formKey="logging.directories.snapshotted"
            effective={resolvedValue?.logging?.directories?.snapshotted}
          />
          <PolicyLogDetailsInput
            id="directory-ignored"
            title={t`Directory Ignored`}
            description={t`Log verbosity when a directory is ignored`}
            form={form}
            formKey="logging.directories.ignored"
            effective={resolvedValue?.logging?.directories?.ignored}
          />
          <PolicyLogDetailsInput
            id="file-snapshotted"
            title={t`File Snapshotted`}
            description={t`Log verbosity when a file, symbolic link, etc. is snapshotted`}
            form={form}
            formKey="logging.entries.snapshotted"
            effective={resolvedValue?.logging?.entries?.snapshotted}
          />
          <PolicyLogDetailsInput
            id="file-ignored"
            title={t`File Ignored`}
            description={t`Log verbosity when a file, symbolic link, etc. is ignored`}
            form={form}
            formKey="logging.entries.ignored"
            effective={resolvedValue?.logging?.entries?.ignored}
          />
          <PolicyLogDetailsInput
            id="cache-hit"
            title={t`Cache Hit`}
            description={t`Log verbosity when a cache is used instead of uploading the file`}
            form={form}
            formKey="logging.entries.cacheHit"
            effective={resolvedValue?.logging?.entries?.cacheHit}
          />
          <PolicyLogDetailsInput
            id="cache-miss"
            title={t`Cache Miss`}
            description={t`Log verbosity when a cache cannot be used and a file must be hashed`}
            form={form}
            formKey="logging.entries.cacheMiss"
            effective={resolvedValue?.logging?.entries?.cacheMiss}
          />
        </Accordion>
      </ScrollAreaAutosize>
    </TabsPanel>
  );
}
