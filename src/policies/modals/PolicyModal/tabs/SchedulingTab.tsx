import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Anchor,
  ScrollAreaAutosize,
  Table,
  TabsPanel,
  Text
} from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import FormattedDate from "../../../../core/FormattedDate";
import RelativeDate from "../../../../core/RelativeDate";
import type { Policy } from "../../../../core/types";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import PolicyInheritYesNoPolicyInput from "../policy-inputs/PolicyInheritYesNoPolicyInput";
import PolicyNumberSelect from "../policy-inputs/PolicyNumberSelect";
import PolicyTextListInput from "../policy-inputs/PolicyTextListInput";
import PolicyTimeOfDayInput from "../policy-inputs/PolicyTimeOfDayInput";
import type { PolicyForm } from "../types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
  resolvedValue?: Policy;
  upcomingSnapshotTimes?: string[];
};

export default function SchedulingTab({ form, resolvedValue, upcomingSnapshotTimes }: Props) {
  return (
    <TabsPanel value="scheduling" px="xs">
      <ScrollAreaAutosize mah={600} scrollbarSize={4}>
        <Accordion variant="contained">
          <PolicyNumberSelect
            id="snapshot-frequency"
            title={t`Snapshot Frequency`}
            description={t`How frequently to create snapshots in KopiaUI or Kopia server (has no effect outside of the server mode)`}
            placeholder={t`Select Snapshot Frequency`}
            data={[
              { label: t`None`, value: "" },
              { label: t`Every 10 Minutes`, value: "600" },
              { label: t`Every 15 Minutes`, value: "900" },
              { label: t`Every 20 Minutes`, value: "1200" },
              { label: t`Every 30 Minutes`, value: "1800" },
              { label: t`Every hour`, value: "3600" },
              { label: t`Every 3 hours`, value: "10800" },
              { label: t`Every 6 hours`, value: "21600" },
              { label: t`Every 12 hours`, value: "43200" }
            ]}
            form={form}
            formKey="scheduling.intervalSeconds"
          />
          <PolicyTimeOfDayInput
            id="time-of-day"
            title={t`Time Of Day`}
            description={t`Create snapshots at the specified times of day (24hr format)`}
            // placeholder="e.g. 17:00"
            form={form}
            formKey="scheduling.timeOfDay"
            effective={resolvedValue?.scheduling?.timeOfDay}
          />

          <PolicyTextListInput
            id="cron-expression"
            title={t`Cron Expressions`}
            description={t`Snapshot schedules using UNIX crontab syntax:`}
            placeholder="minute hour day month weekday #comment"
            form={form}
            formKey="scheduling.cron"
            infoNode={
              <Text fz="xs">
                See{" "}
                <Anchor fz="xs" href="https://github.com/hashicorp/cronexpr#implementation" target="_blank">
                  supported format details.
                </Anchor>
              </Text>
            }
            effective={resolvedValue?.scheduling?.cron}
          />
          <PolicyInheritYesNoPolicyInput
            id="run-missed-snapshots-on-startup"
            title={t`Run Missed Snapshots on Startup`}
            description={t`Immediately run any missed snapshots when kopia starts (only relevant for Time-of-day snapshots)`}
            form={form}
            formKey="scheduling.runMissed"
            effective={resolvedValue?.scheduling?.runMissed}
          />
          <PolicyInheritYesNoPolicyInput
            id="manual-snapshots-only"
            title={t`Manual Snapshots Only`}
            description={t`Only create snapshots manually (disables scheduled snapshots)`}
            form={form}
            formKey="scheduling.manual"
            effective={resolvedValue?.scheduling?.manual}
          />
          <AccordionItem value="before-command-mode">
            <PolicyAccordionControl
              title={t`Upcoming Snapshots`}
              description={t`Times of upcoming snapshots calculated based on policy parameters`}
              isConfigured={upcomingSnapshotTimes?.length !== undefined && upcomingSnapshotTimes?.length > 0}
            />
            <AccordionPanel>
              {upcomingSnapshotTimes !== undefined && (
                <Table fz="xs" withTableBorder striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>
                        <Trans>Timestamp</Trans>
                      </Table.Th>
                      <Table.Th>
                        <Trans>From now</Trans>
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {upcomingSnapshotTimes.map((t) => {
                      return (
                        <Table.Tr key={t}>
                          <Table.Td>
                            <FormattedDate value={t} />
                          </Table.Td>
                          <Table.Td>
                            <RelativeDate value={t} />
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </ScrollAreaAutosize>
    </TabsPanel>
  );
}
