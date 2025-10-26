import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Button,
  Group,
  JsonInput,
  Modal,
  ScrollAreaAutosize,
  Select,
  Stack,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertTriangle,
  IconCalendarX,
  IconClock,
  IconFileText,
  IconFileZip,
  IconFolderCog,
  IconFolderOpen,
  IconSettingsCog,
  IconTestPipe,
  IconUpload,
} from "@tabler/icons-react";
import { yupResolver } from "mantine-form-yup-resolver";
import { useEffect } from "react";
import * as Yup from "yup";
import IconWrapper from "../../../core/IconWrapper";
import NumberSelect from "../../../core/NumberSelect";
import useApiRequest from "../../../core/hooks/useApiRequest";
import kopiaService from "../../../core/kopiaService";
import type { Policy, PolicyRef, Snapshot } from "../../../core/types";
import modalBaseStyles from "../../../styles/modalStyles";
import modalClasses from "../../../styles/modals.module.css";
import PolicyAccordionControl from "./components/PolicyAccordionControl";
import PolicyCompressionInput from "./policy-inputs/PolicyCompressionInput";
import PolicyInheritYesNoPolicyInput from "./policy-inputs/PolicyInheritYesNoPolicyInput";
import PolicyLogDetailsInput from "./policy-inputs/PolicyLogDetailsInput";
import PolicyNumberInput from "./policy-inputs/PolicyNumberInput";
import PolicyTextAreaInput from "./policy-inputs/PolicyTextAreaInput";
import PolicyTextInput from "./policy-inputs/PolicyTextInput";
import type { PolicyForm } from "./types";
type Props = {
  policy?: PolicyRef;
  onCancel: () => void;
  onUpdated: (snapshots: Snapshot[]) => void;
};

const schema = Yup.object({
  description: Yup.string().max(250).label("Description"),
});

export default function PolicyModal({ policy, onCancel, onUpdated }: Props) {
  const form = useForm<PolicyForm>({
    mode: "controlled",
    initialValues: {},
    validate: yupResolver(schema),
  });

  const {
    error: loadError,
    loading: loadingData,
    execute: executeLoad,
  } = useApiRequest({
    action: (data?: Policy) => kopiaService.getPolicy(policy!.target),
    onReturn: (g) => {
      form.initialize(g);
    },
  });

  useEffect(() => {
    if (policy) {
      executeLoad();
    }
  }, []);

  async function submitForm(values: PolicyForm) {
    // await execute(values);
  }
  return (
    <Modal
      title="Directory: root@hostname:/data"
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="xl"
    >
      <form
        id="update-description-form"
        onSubmit={form.onSubmit(submitForm)}
        className={modalClasses.container}
      >
        <Stack w="100%">
          {/* <ErrorAlert error={error} /> */}
          <Tabs
            defaultValue="snapshot-retention"
            orientation="vertical"
            variant="outline"
            styles={{ tabLabel: { textAlign: "left" } }}
          >
            <TabsList ta="left">
              <TabsTab
                value="snapshot-retention"
                leftSection={
                  <IconWrapper icon={IconCalendarX} size={18} color="teal" />
                }
              >
                Snapshot Retention
              </TabsTab>
              <TabsTab
                value="files"
                leftSection={
                  <IconWrapper icon={IconFolderOpen} size={18} color="yellow" />
                }
              >
                Files
              </TabsTab>
              <TabsTab
                value="error-handling"
                leftSection={
                  <IconWrapper icon={IconAlertTriangle} size={18} color="red" />
                }
              >
                Error Handling
              </TabsTab>
              <TabsTab
                value="compression"
                leftSection={
                  <IconWrapper icon={IconFileZip} size={18} color="grape" />
                }
              >
                Compression
              </TabsTab>
              <TabsTab
                value="scheduling"
                leftSection={
                  <IconWrapper icon={IconClock} size={18} color="green" />
                }
              >
                Scheduling
              </TabsTab>
              <TabsTab
                value="upload"
                leftSection={
                  <IconWrapper icon={IconUpload} size={18} color="blue" />
                }
              >
                Upload
              </TabsTab>
              <TabsTab
                value="snapshot-actions"
                leftSection={
                  <IconWrapper
                    icon={IconSettingsCog}
                    size={18}
                    color="indigo"
                  />
                }
              >
                Snapshot Actions
              </TabsTab>
              <TabsTab
                value="folder-actions"
                leftSection={
                  <IconWrapper icon={IconFolderCog} size={18} color="pink" />
                }
              >
                Folder Actions
              </TabsTab>
              <TabsTab
                value="logging"
                leftSection={
                  <IconWrapper icon={IconFileText} size={18} color="violet" />
                }
              >
                Logging
              </TabsTab>
              <TabsTab
                value="other"
                leftSection={
                  <IconWrapper icon={IconTestPipe} size={18} color="lime" />
                }
              >
                Other
              </TabsTab>
            </TabsList>
            <TabsPanel value="snapshot-retention" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <PolicyNumberInput
                    id="latest-snapshots"
                    title="Latest Snapshots"
                    description="Number of the most recent snapshots to retain per source"
                    placeholder="# of latest snapshots"
                    form={form}
                    formKey="retention.keepLatest"
                  />
                  <PolicyNumberInput
                    id="hourly"
                    title="Hourly"
                    description="How many hourly snapshots to retain per source. The latest snapshot from each hour will be retained"
                    placeholder="# of hourly snapshots"
                    form={form}
                    formKey="retention.keepHourly"
                  />
                  <PolicyNumberInput
                    id="daily"
                    title="Daily"
                    description="How many daily snapshots to retain per source. The latest snapshot from each day will be retained"
                    placeholder="# of daily snapshots"
                    form={form}
                    formKey="retention.keepDaily"
                  />
                  <PolicyNumberInput
                    id="weekly"
                    title="Weekly"
                    description="How many weekly snapshots to retain per source. The latest snapshot from each week will be retained"
                    placeholder="# of weekly snapshots"
                    form={form}
                    formKey="retention.keepWeekly"
                  />
                  <PolicyNumberInput
                    id="monthly"
                    title="Monthly"
                    description="How many monthly snapshots to retain per source. The latest snapshot from each calendar month will be retained"
                    placeholder="# of monthly snapshots"
                    form={form}
                    formKey="retention.keepMonthly"
                  />
                  <PolicyNumberInput
                    id="annual"
                    title="Annual"
                    description="How many annual snapshots to retain per source. The latest snapshot from each calendar year will be retained"
                    placeholder="# of annual snapshots"
                    form={form}
                    formKey="retention.keepAnnual"
                  />
                  <PolicyInheritYesNoPolicyInput
                    id="ignore-idential-snapshots"
                    title="Ignore Identical Snapshots"
                    description="Do NOT save a snapshot when no files have been changed"
                    form={form}
                    formKey="retention.ignoreIdenticalSnapshots"
                  />
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
            <TabsPanel value="files" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <PolicyTextAreaInput
                    id="ignore-files"
                    title="Ignore Files"
                    description="List of file and directory names to ignore."
                    form={form}
                    formKey="files.ignore"
                    placeholder="e.g. /file.txt"
                  >
                    <Switch
                      label="Ignore Rules From Parent Directories"
                      description="When set, ignore rules from the parent directory are ignored"
                      {...form.getInputProps("files.noParentIgnore", {
                        type: "checkbox",
                      })}
                    />
                  </PolicyTextAreaInput>
                  <PolicyTextAreaInput
                    id="ignore-rule-files"
                    title="Ignore Rule Files"
                    description="List of additional files containing ignore rules (each file configures ignore rules for the directory and its subdirectories)"
                    form={form}
                    formKey="files.ignoreDotFiles"
                  >
                    <Switch
                      label="Ignore Rule Files From Parent Directories"
                      description="When set, the files specifying ignore rules (.kopiaignore, etc.) from the parent directory are ignored"
                      {...form.getInputProps("files.noParentDotFiles")}
                    />
                  </PolicyTextAreaInput>
                  <PolicyInheritYesNoPolicyInput
                    id="ignore-well-known-cache-dirs"
                    title="Ignore Well-Known Cache Directories"
                    description="Ignore directories containing CACHEDIR.TAG and similar"
                    form={form}
                    formKey="files.ignoreCacheDirs"
                  />

                  <PolicyNumberInput
                    id="ignore-files-larger-than"
                    title="Ignore Files larger than"
                    description="When set, the files larger than the specified size are ignored (specified in bytes)"
                    form={form}
                    formKey="files.maxFileSize"
                  />
                  <PolicyInheritYesNoPolicyInput
                    id="scan-only-one-fs"
                    title="Scan only one filesystem"
                    description="Do not cross filesystem boundaries when creating a snapshot"
                    form={form}
                    formKey="files.oneFileSystem"
                  />
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
            <TabsPanel value="error-handling" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <PolicyInheritYesNoPolicyInput
                    id="ignore-dir-errors"
                    title="Ignore Directory Errors"
                    description="Treat directory read errors as non-fatal."
                    form={form}
                    formKey="errorHandling.ignoreDirectoryErrors"
                  />
                  <PolicyInheritYesNoPolicyInput
                    id="ignore-file-errors"
                    title="Ignore File Errors"
                    description="Treat file errors as non-fatal."
                    form={form}
                    formKey="errorHandling.ignoreFileErrors"
                  />
                  <PolicyInheritYesNoPolicyInput
                    id="ignore-unknown-dir-entries"
                    title="Ignore Unknown Directory Entries"
                    description="Treat unrecognized/unsupported directory entries as non-fatal errors."
                    form={form}
                    formKey="errorHandling.ignoreUnknownTypes"
                  />
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
            <TabsPanel value="compression" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <PolicyCompressionInput
                    id="compression-alg"
                    title="Compression Algorithm"
                    description="Specify compression algorithm to use when snapshotting files in this directory and subdirectories"
                    form={form}
                    formKey="compression.compressorName"
                  />

                  <PolicyNumberInput
                    id="minimum-file-size"
                    title="Minimum File Size"
                    description="Files that are smaller than the provided value will not be compressed"
                    placeholder="Minimum file size in bytes"
                    form={form}
                    formKey="compression.minSize"
                  />
                  <PolicyNumberInput
                    id="max-file-size"
                    title="Max File Size"
                    description="Files whose size exceeds the provided value will not be compressed"
                    placeholder="Maximum file size in bytes"
                    form={form}
                    formKey="compression.maxSize"
                  />
                  <PolicyTextAreaInput
                    id="only-compress-ext"
                    title="Only Compress Extensions"
                    description="Only compress files with the following file extensions (one extension per line)"
                    placeholder="e.g. .txt"
                    form={form}
                    formKey="compression.onlyCompress"
                  />
                  <PolicyTextAreaInput
                    id="never-compress-ext"
                    title="Never Compress Extensions"
                    description="Never compress the following file extensions (one extension per line)"
                    placeholder="e.g. .mp4"
                    form={form}
                    formKey="compression.neverCompress"
                  />
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
            <TabsPanel value="scheduling" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <AccordionItem value="snapshot-frequency">
                    <PolicyAccordionControl
                      title="Snapshot Frequency"
                      description="How frequently to create snapshots in KopiaUI or Kopia server (has no effect outside of the server mode)"
                      isConfigured={
                        form.values.scheduling?.intervalSeconds !== undefined
                      }
                    />
                    <AccordionPanel>
                      <Group grow>
                        <NumberSelect
                          label="Defined"
                          description="This policy"
                          data={[
                            { label: "None", value: "" },
                            { label: "Every 10 Minutes", value: "600" },
                            { label: "Every 15 Minutes", value: "900" },
                            { label: "Every 20 Minutes", value: "1200" },
                            { label: "Every 30 Minutes", value: "1800" },
                            { label: "Every hour", value: "3600" },
                            { label: "Every 3 hours", value: "10800" },
                            { label: "Every 6 hours", value: "21600" },
                            { label: "Every 12 hours", value: "43200" },
                          ]}
                          withCheckIcon={false}
                          {...form.getInputProps("scheduling.intervalSeconds")}
                        />
                        <NumberSelect
                          description="Defined in global policy"
                          label="Effective"
                          data={[
                            { label: "None", value: "" },
                            { label: "Every 10 Minutes", value: "600" },
                            { label: "Every 15 Minutes", value: "900" },
                            { label: "Every 20 Minutes", value: "1200" },
                            { label: "Every 30 Minutes", value: "1800" },
                            { label: "Every hour", value: "3600" },
                            { label: "Every 3 hours", value: "10800" },
                            { label: "Every 6 hours", value: "21600" },
                            { label: "Every 12 hours", value: "43200" },
                          ]}
                          withCheckIcon={false}
                          disabled
                        />
                      </Group>
                    </AccordionPanel>
                  </AccordionItem>
                  <PolicyTextAreaInput
                    id="time-of-day"
                    title="Time Of Day"
                    description="Create snapshots at the specified times of day (24hr format)"
                    placeholder="e.g. 17:00"
                    form={form}
                    formKey="scheduling.timeOfDay"
                  />
                  <PolicyTextInput
                    id="cron-expression"
                    title="Cron Expressions"
                    description="Snapshot schedules using UNIX crontab syntax (one per line):"
                    placeholder="minute hour day month weekday #comment"
                    form={form}
                    formKey="scheduling.cron"
                  />
                  <PolicyInheritYesNoPolicyInput
                    id="run-missed-snapshots-on-startup"
                    title="Run Missed Snapshots on Startup"
                    description="Immediately run any missed snapshots when kopia starts (only relevant for Time-of-day snapshots)"
                    form={form}
                    formKey="scheduling.runMissed"
                  />
                  <PolicyInheritYesNoPolicyInput
                    id="manual-snapshots-only"
                    title="Manual Snapshots Only"
                    description="Only create snapshots manually (disables scheduled snapshots)"
                    form={form}
                    formKey="scheduling.manual"
                  />
                  TODO: Add estimates
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
            <TabsPanel value="upload" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <PolicyNumberInput
                    id="maximum-parallel-snapshots"
                    title="Maximum Parallel Snapshots"
                    description="Maximum number of snapshots that can be uploaded simultaneously"
                    placeholder="must be specified using global, user, or host policy"
                    form={form}
                    formKey="upload.maxParallelSnapshots"
                  />
                  <PolicyNumberInput
                    id="maximum-parallel-file-reads"
                    title="Maximum Parallel File Reads"
                    description="Maximum number of files that will be read in parallel (defaults to the number of logical processors)"
                    placeholder="max number of parallel file reads"
                    form={form}
                    formKey="upload.maxParallelFileReads"
                  />
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
            <TabsPanel value="snapshot-actions" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <PolicyTextInput
                    id="before-snapshot"
                    title="Before Snapshot"
                    description="Script to run before snapshot"
                    form={form}
                    formKey="actions.beforeSnapshotRoot.script"
                  />
                  <PolicyNumberInput
                    id="before-timeout"
                    title="Timeout - Before"
                    description="Timeout in seconds before Kopia kills the process"
                    form={form}
                    formKey="actions.beforeSnapshotRoot.timeout"
                  />
                  <AccordionItem value="before-command-mode">
                    <PolicyAccordionControl
                      title="Command Mode - Before"
                      description=" Essential (must succeed; default behavior), optional (failures are tolerated), or async (Kopia will start the action but not wait for it to finish)"
                      isConfigured={
                        form.values.actions?.beforeSnapshotRoot?.mode !==
                        undefined
                      }
                    />
                    <AccordionPanel>
                      <Group grow>
                        <Select
                          label="Defined"
                          description="This policy"
                          data={[
                            { label: "Must Succeed", value: "essential" },
                            { label: "Ignore failures", value: "optional" },
                            {
                              label: "Run asynchronously, ignore failures",
                              value: "async",
                            },
                          ]}
                          withCheckIcon={false}
                          allowDeselect={false}
                          {...form.getInputProps(
                            "actions.beforeSnapshotRoot.mode"
                          )}
                        />
                        <Select
                          description="Defined in global policy"
                          label="Effective"
                          data={[
                            { label: "Must Succeed", value: "essential" },
                            { label: "Ignore failures", value: "optional" },
                            {
                              label: "Run asynchronously, ignore failures",
                              value: "async",
                            },
                          ]}
                          withCheckIcon={false}
                          allowDeselect={false}
                          disabled
                        />
                      </Group>
                    </AccordionPanel>
                  </AccordionItem>
                  <PolicyTextInput
                    id="after-snapshot"
                    title="After Snapshot"
                    description="Script to run after snapshot"
                    form={form}
                    formKey="actions.afterSnapshotRoot.script"
                  />
                  <PolicyNumberInput
                    id="after-timeout"
                    title="Timeout - After"
                    description="Timeout in seconds before Kopia kills the process"
                    form={form}
                    formKey="actions.afterSnapshotRoot.timeout"
                  />
                  <AccordionItem value="after-command-mode">
                    <PolicyAccordionControl
                      title="Command Mode - After"
                      description="Essential (must succeed; default behavior), optional (failures are tolerated), or async (Kopia will start the action but not wait for it to finish)"
                      isConfigured={
                        form.values.actions?.afterSnapshotRoot?.mode !==
                        undefined
                      }
                    />
                    <AccordionPanel>
                      <Group grow>
                        <Select
                          label="Defined"
                          description="This policy"
                          data={[
                            { label: "Must Succeed", value: "essential" },
                            { label: "Ignore failures", value: "optional" },
                            {
                              label: "Run asynchronously, ignore failures",
                              value: "async",
                            },
                          ]}
                          withCheckIcon={false}
                          allowDeselect={false}
                          {...form.getInputProps(
                            "actions.afterSnapshotRoot.mode"
                          )}
                        />
                        <Select
                          description="Defined in global policy"
                          label="Effective"
                          data={[
                            { label: "Must Succeed", value: "essential" },
                            { label: "Ignore failures", value: "optional" },
                            {
                              label: "Run asynchronously, ignore failures",
                              value: "async",
                            },
                          ]}
                          withCheckIcon={false}
                          allowDeselect={false}
                          disabled
                        />
                      </Group>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
            <TabsPanel value="folder-actions" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <PolicyTextInput
                    id="before-folder"
                    title="Before Folder"
                    description="Script to run before folder"
                    form={form}
                    formKey="actions.beforeFolder.script"
                  />
                  <PolicyNumberInput
                    id="before-timeout"
                    title="Timeout - Before"
                    description="Timeout in seconds before Kopia kills the process"
                    form={form}
                    formKey="actions.beforeFolder.timeout"
                  />
                  <AccordionItem value="before-command-mode">
                    <PolicyAccordionControl
                      title="Command Mode - Before"
                      description="Essential (must succeed; default behavior), optional (failures are tolerated), or async (Kopia will start the action but not wait for it to finish)"
                      isConfigured={
                        form.values.actions?.beforeFolder?.mode !== undefined
                      }
                    />
                    <AccordionPanel>
                      <Group grow>
                        <Select
                          label="Defined"
                          description="This policy"
                          data={[
                            { label: "Must Succeed", value: "essential" },
                            { label: "Ignore failures", value: "optional" },
                            {
                              label: "Run asynchronously, ignore failures",
                              value: "async",
                            },
                          ]}
                          withCheckIcon={false}
                          allowDeselect={false}
                          {...form.getInputProps("actions.beforeFolder.mode")}
                        />
                        <Select
                          description="Defined in global policy"
                          label="Effective"
                          data={[
                            { label: "Must Succeed", value: "essential" },
                            { label: "Ignore failures", value: "optional" },
                            {
                              label: "Run asynchronously, ignore failures",
                              value: "async",
                            },
                          ]}
                          withCheckIcon={false}
                          allowDeselect={false}
                          disabled
                        />
                      </Group>
                    </AccordionPanel>
                  </AccordionItem>
                  <PolicyTextInput
                    id="after-folder"
                    title="After Folder"
                    description="Script to run after folder"
                    form={form}
                    formKey="actions.afterFolder.script"
                  />
                  <PolicyNumberInput
                    id="after-timeout"
                    title="Timeout - After"
                    description="Timeout in seconds before Kopia kills the process"
                    form={form}
                    formKey="actions.afterFolder.timeout"
                  />
                  <AccordionItem value="after-command-mode">
                    <PolicyAccordionControl
                      title="Command Mode - After"
                      description="Essential (must succeed; default behavior), optional (failures are tolerated), or async (Kopia will start the action but not wait for it to finish)"
                      isConfigured={
                        form.values.actions?.afterFolder?.mode !== undefined
                      }
                    />

                    <AccordionPanel>
                      <Group grow>
                        <Select
                          label="Defined"
                          description="This policy"
                          data={[
                            { label: "Must Succeed", value: "essential" },
                            { label: "Ignore failures", value: "optional" },
                            {
                              label: "Run asynchronously, ignore failures",
                              value: "async",
                            },
                          ]}
                          withCheckIcon={false}
                          allowDeselect={false}
                          {...form.getInputProps("actions.afterFolder.mode")}
                        />
                        <Select
                          description="Defined in global policy"
                          label="Effective"
                          data={[
                            { label: "Must Succeed", value: "essential" },
                            { label: "Ignore failures", value: "optional" },
                            {
                              label: "Run asynchronously, ignore failures",
                              value: "async",
                            },
                          ]}
                          withCheckIcon={false}
                          allowDeselect={false}
                          disabled
                        />
                      </Group>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
            <TabsPanel value="logging" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <PolicyLogDetailsInput
                    id="directory-snapshotted"
                    title="Directory Snapshotted"
                    description="Log verbosity when a directory is snapshotted"
                    form={form}
                    formKey="logging.directories.snapshotted"
                  />
                  <PolicyLogDetailsInput
                    id="directory-ignored"
                    title="Directory Ignored"
                    description="Log verbosity when a directory is ignored"
                    form={form}
                    formKey="logging.directories.ignored"
                  />
                  <PolicyLogDetailsInput
                    id="file-snapshotted"
                    title="File Snapshotted"
                    description="Log verbosity when a file, symbolic link, etc. is snapshotted"
                    form={form}
                    formKey="logging.entries.snapshotted"
                  />
                  <PolicyLogDetailsInput
                    id="file-ignored"
                    title="File Ignored"
                    description="Log verbosity when a file, symbolic link, etc. is ignored"
                    form={form}
                    formKey="logging.entries.ignored"
                  />
                  <PolicyLogDetailsInput
                    id="cache-hit"
                    title="Cache Hit"
                    description="Log verbosity when a cache is used instead of uploading the file"
                    form={form}
                    formKey="logging.entries.cacheHit"
                  />
                  <PolicyLogDetailsInput
                    id="cache-miss"
                    title="Cache Miss"
                    description="Log verbosity when a cache cannot be used and a file must be hashed"
                    form={form}
                    formKey="logging.entries.cacheMiss"
                  />
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
            <TabsPanel value="other" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <AccordionItem value="disable-parent-policy-eval">
                    <PolicyAccordionControl
                      title="Disable Parent Policy Evaluation"
                      description="Prevents any parent policies from affecting this directory and its subdirectories"
                      isConfigured={form.values.noParent !== undefined}
                    />
                    <AccordionPanel>
                      <Switch
                        label="Disable Parent Policy"
                        {...form.getInputProps("noParent", {
                          type: "checkbox",
                        })}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem value="json-policy">
                    <PolicyAccordionControl
                      title="JSON Representation"
                      description="This is the internal representation of a policy"
                      isConfigured={true}
                    />
                    <AccordionPanel>
                      <JsonInput
                        rows={10}
                        value={JSON.stringify(form.values, null, 2)}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
          </Tabs>
        </Stack>
      </form>

      <Group className={modalClasses.footer}>
        <Button
          size="xs"
          color="gray"
          variant="subtle"
          onClick={onCancel}
          disabled={false}
        >
          Cancel
        </Button>
        <Button
          size="xs"
          type="submit"
          form="update-description-form"
          loading={false || !form.isValid()}
        >
          Save
        </Button>
      </Group>
    </Modal>
  );
}
