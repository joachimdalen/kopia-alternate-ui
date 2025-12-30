import { t } from "@lingui/core/macro";
import { Accordion, ScrollAreaAutosize, TabsPanel } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import type { Policy } from "../../../../core/types";
import PolicyCompressionInput from "../policy-inputs/PolicyCompressionInput";
import PolicyNumberInput from "../policy-inputs/PolicyNumberInput";
import PolicyTextListInput from "../policy-inputs/PolicyTextListInput";
import type { PolicyForm } from "../types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
  resolvedValue?: Policy;
};

export default function CompressionTab({ form, resolvedValue }: Props) {
  return (
    <TabsPanel value="compression" px="xs">
      <ScrollAreaAutosize mah={600} scrollbarSize={4}>
        <Accordion variant="contained">
          <PolicyCompressionInput
            id="compression-alg"
            title={t`Compression Algorithm`}
            description={t`Specify compression algorithm to use when snapshotting files in this directory and subdirectories`}
            form={form}
            formKey="compression.compressorName"
            effective={resolvedValue?.compression?.compressorName}
          />

          <PolicyNumberInput
            id="minimum-file-size"
            title={t`Minimum File Size`}
            description={t`Files that are smaller than the provided value will not be compressed`}
            placeholder={t`Minimum file size in bytes`}
            form={form}
            formKey="compression.minSize"
            effective={resolvedValue?.compression?.minSize}
          />
          <PolicyNumberInput
            id="max-file-size"
            title={t`Max File Size`}
            description={t`Files whose size exceeds the provided value will not be compressed`}
            placeholder={t`Maximum file size in bytes`}
            form={form}
            formKey="compression.maxSize"
            effective={resolvedValue?.compression?.maxSize}
          />
          <PolicyTextListInput
            id="only-compress-ext"
            title={t`Only Compress Extensions`}
            description={t`Only compress files with the following file extensions (one extension per line)`}
            placeholder="e.g. .txt"
            form={form}
            formKey="compression.onlyCompress"
            effective={resolvedValue?.compression?.onlyCompress}
          />
          <PolicyTextListInput
            id="never-compress-ext"
            title={t`Never Compress Extensions`}
            description={t`Never compress the following file extensions (one extension per line)`}
            placeholder="e.g. .mp4"
            form={form}
            formKey="compression.neverCompress"
            effective={resolvedValue?.compression?.neverCompress}
          />
        </Accordion>
      </ScrollAreaAutosize>
    </TabsPanel>
  );
}
