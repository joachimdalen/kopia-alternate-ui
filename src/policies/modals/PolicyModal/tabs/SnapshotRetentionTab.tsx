import { t } from "@lingui/core/macro";
import { Accordion, ScrollAreaAutosize, TabsPanel } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import type { Policy } from "../../../../core/types";
import PolicyInheritYesNoPolicyInput from "../policy-inputs/PolicyInheritYesNoPolicyInput";
import PolicyNumberInput from "../policy-inputs/PolicyNumberInput";
import type { PolicyForm } from "../types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
  resolvedValue?: Policy;
};

export default function SnapshotRetentionTab({ form, resolvedValue }: Props) {
  return (
    <TabsPanel value="snapshot-retention" px="xs">
      <ScrollAreaAutosize mah={600} scrollbarSize={4}>
        <Accordion variant="contained">
          <PolicyNumberInput
            id="latest-snapshots"
            title={t`Latest Snapshots`}
            description={t`Number of the most recent snapshots to retain per source`}
            placeholder={t`# of latest snapshots`}
            form={form}
            formKey="retention.keepLatest"
            effective={resolvedValue?.retention?.keepLatest}
          />
          <PolicyNumberInput
            id="hourly"
            title={t`Hourly`}
            description={t`How many hourly snapshots to retain per source. The latest snapshot from each hour will be retained`}
            placeholder={t`# of hourly snapshots`}
            form={form}
            formKey="retention.keepHourly"
            effective={resolvedValue?.retention?.keepHourly}
          />
          <PolicyNumberInput
            id="daily"
            title={t`Daily`}
            description={t`How many daily snapshots to retain per source. The latest snapshot from each day will be retained`}
            placeholder={t`# of daily snapshots`}
            form={form}
            formKey="retention.keepDaily"
            effective={resolvedValue?.retention?.keepDaily}
          />
          <PolicyNumberInput
            id="weekly"
            title={t`Weekly`}
            description={t`How many weekly snapshots to retain per source. The latest snapshot from each week will be retained`}
            placeholder={t`# of weekly snapshots`}
            form={form}
            formKey="retention.keepWeekly"
            effective={resolvedValue?.retention?.keepWeekly}
          />
          <PolicyNumberInput
            id="monthly"
            title={t`Monthly`}
            description={t`How many monthly snapshots to retain per source. The latest snapshot from each calendar month will be retained`}
            placeholder={t`# of monthly snapshots`}
            form={form}
            formKey="retention.keepMonthly"
            effective={resolvedValue?.retention?.keepMonthly}
          />
          <PolicyNumberInput
            id="annual"
            title={t`Annual`}
            description={t`How many annual snapshots to retain per source. The latest snapshot from each calendar year will be retained`}
            placeholder={t`# of annual snapshots`}
            form={form}
            formKey="retention.keepAnnual"
            effective={resolvedValue?.retention?.keepAnnual}
          />
          <PolicyInheritYesNoPolicyInput
            id="ignore-idential-snapshots"
            title={t`Ignore Identical Snapshots`}
            description={t`Do NOT save a snapshot when no files have been changed`}
            form={form}
            formKey="retention.ignoreIdenticalSnapshots"
            effective={resolvedValue?.retention?.ignoreIdenticalSnapshots}
          />
        </Accordion>
      </ScrollAreaAutosize>
    </TabsPanel>
  );
}
