import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Anchor,
  Button,
  Group,
  JsonInput,
  LoadingOverlay,
  Modal,
  ScrollAreaAutosize,
  Stack,
  Switch,
  Table,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text
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
  IconUpload
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect, useState } from "react";
import { ErrorAlert } from "../../../core/ErrorAlert/ErrorAlert";
import FormattedDate from "../../../core/FormattedDate";
import IconWrapper from "../../../core/IconWrapper";
import RelativeDate from "../../../core/RelativeDate";
import { useServerInstanceContext } from "../../../core/context/ServerInstanceContext";
import useApiRequest from "../../../core/hooks/useApiRequest";
import type { Policy, ResolvedPolicy, SourceInfo } from "../../../core/types";
import modalBaseStyles from "../../../styles/modalStyles";
import modalClasses from "../../../styles/modals.module.css";
import { getPolicyType } from "../../policiesUtil";
import DeletePolicyButton from "./components/DeletePolicyButton";
import PolicyAccordionControl from "./components/PolicyAccordionControl";
import PolicyCompressionInput from "./policy-inputs/PolicyCompressionInput";
import PolicyInheritYesNoPolicyInput from "./policy-inputs/PolicyInheritYesNoPolicyInput";
import PolicyLogDetailsInput from "./policy-inputs/PolicyLogDetailsInput";
import PolicyNumberInput from "./policy-inputs/PolicyNumberInput";
import PolicyNumberSelect from "./policy-inputs/PolicyNumberSelect";
import PolicySelect from "./policy-inputs/PolicySelect";
import PolicyTextInput from "./policy-inputs/PolicyTextInput";
import PolicyTextListInput from "./policy-inputs/PolicyTextListInput";
import PolicyTimeOfDayInput from "./policy-inputs/PolicyTimeOfDayInput";
import type { PolicyForm } from "./types";

type Props = {
  target: SourceInfo;
  isNew: boolean;
  onCancel: () => void;
  onDeleted?: () => void;
  onSubmitted?: (policy: Policy) => void;
  saveOnSubmit?: boolean;
};

function mergePolicy(current: Policy) {
  return merge(
    {
      actions: {
        afterFolder: {},
        afterSnapshotRoot: {},
        beforeFolder: {},
        beforeSnapshotRoot: {}
      },
      osSnapshots: {
        volumeShadowCopy: {}
      },
      logging: {
        directories: {},
        entries: {}
      }
    } satisfies Policy,
    current
  );
}

export default function PolicyModal({ isNew, target, onCancel, onSubmitted, onDeleted, saveOnSubmit = true }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const [resolved, setResolved] = useState<ResolvedPolicy>();
  const isGlobal = target.host === "" && target.userName === "" && target.path === "";
  const form = useForm<PolicyForm, (values: PolicyForm) => Policy>({
    mode: "controlled",
    initialValues: {},
    transformValues(values) {
      return { ...values };
    }
    // validate: yupResolver(schema),
  });

  const {
    error: loadError,
    loading: loadingData,
    execute: executeLoad
  } = useApiRequest({
    action: () => kopiaService.getPolicy(target),
    onReturn: (g) => {
      form.initialize(mergePolicy(g));
      executeResolve(g);
    }
  });

  const {
    error: resolveError,
    loading: loadingResolve,
    execute: executeResolve
  } = useApiRequest({
    action: (data?: PolicyForm) =>
      kopiaService.resolvePolicy(target, {
        numUpcomingSnapshotTimes: 5,
        updates: data!
      }),
    onReturn: (g) => {
      if (isNew) {
        form.initialize(mergePolicy(g.defined));
      }
      setResolved(g);
    }
  });

  const saveAction = useApiRequest({
    action: (data?: Policy) => kopiaService.savePolicy(data!, target),
    showErrorAsNotification: true,
    onReturn: () => {
      onCancel();
    }
  });

  useEffect(() => {
    async function intLoad() {
      await executeLoad();
    }
    async function intResolve() {
      await executeResolve({});
    }
    if (!isNew) {
      intLoad();
    } else {
      // const np: Policy = {};
      // form.initialize(np);
      intResolve();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolvedValue = resolved?.effective;

  async function submitForm(values: Policy) {
    if (saveOnSubmit) {
      saveAction.execute(values);
    } else {
      if (onSubmitted !== undefined) {
        onSubmitted(values);
      }
    }
  }
  return (
    <Modal
      title={getPolicyType(target)}
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="xl"
    >
      <form id="update-policy-form" onSubmit={form.onSubmit(submitForm)} className={modalClasses.container}>
        <LoadingOverlay visible={loadingData || loadingResolve || saveAction.loading} />
        <Stack w="100%">
          <ErrorAlert error={loadError || resolveError} />
          <Tabs
            defaultValue="snapshot-retention"
            orientation="vertical"
            variant="outline"
            styles={{ tabLabel: { textAlign: "left" } }}
          >
            <TabsList ta="left">
              <TabsTab
                value="snapshot-retention"
                leftSection={<IconWrapper icon={IconCalendarX} size={18} color="teal" />}
              >
                <Trans>Snapshot Retention</Trans>
              </TabsTab>
              <TabsTab value="files" leftSection={<IconWrapper icon={IconFolderOpen} size={18} color="yellow" />}>
                <Trans>Files</Trans>
              </TabsTab>
              <TabsTab
                value="error-handling"
                leftSection={<IconWrapper icon={IconAlertTriangle} size={18} color="red" />}
              >
                <Trans>Error Handling</Trans>
              </TabsTab>
              <TabsTab value="compression" leftSection={<IconWrapper icon={IconFileZip} size={18} color="grape" />}>
                <Trans>Compression</Trans>
              </TabsTab>
              <TabsTab value="scheduling" leftSection={<IconWrapper icon={IconClock} size={18} color="green" />}>
                <Trans>Scheduling</Trans>
              </TabsTab>
              <TabsTab value="upload" leftSection={<IconWrapper icon={IconUpload} size={18} color="blue" />}>
                <Trans>Upload</Trans>
              </TabsTab>
              <TabsTab
                value="snapshot-actions"
                leftSection={<IconWrapper icon={IconSettingsCog} size={18} color="indigo" />}
              >
                <Trans>Snapshot Actions</Trans>
              </TabsTab>
              <TabsTab value="folder-actions" leftSection={<IconWrapper icon={IconFolderCog} size={18} color="pink" />}>
                <Trans>Folder Actions</Trans>
              </TabsTab>
              <TabsTab value="logging" leftSection={<IconWrapper icon={IconFileText} size={18} color="violet" />}>
                <Trans>Logging</Trans>
              </TabsTab>
              <TabsTab value="other" leftSection={<IconWrapper icon={IconTestPipe} size={18} color="lime" />}>
                <Trans>Other</Trans>
              </TabsTab>
            </TabsList>
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
                      isConfigured={
                        resolved?.upcomingSnapshotTimes?.length !== undefined &&
                        resolved?.upcomingSnapshotTimes?.length > 0
                      }
                    />
                    <AccordionPanel>
                      {resolved?.upcomingSnapshotTimes !== undefined && (
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
                            {resolved.upcomingSnapshotTimes.map((t) => {
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
            <TabsPanel value="upload" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <PolicyNumberInput
                    id="maximum-parallel-snapshots"
                    title={t`Maximum Parallel Snapshots`}
                    description={t`Maximum number of snapshots that can be uploaded simultaneously`}
                    placeholder={t`must be specified using global, user, or host policy`}
                    form={form}
                    formKey="upload.maxParallelSnapshots"
                    effective={resolvedValue?.upload?.maxParallelSnapshots}
                  />
                  <PolicyNumberInput
                    id="maximum-parallel-file-reads"
                    title={t`Maximum Parallel File Reads`}
                    description={t`Maximum number of files that will be read in parallel (defaults to the number of logical processors)`}
                    placeholder={t`max number of parallel file reads`}
                    form={form}
                    formKey="upload.maxParallelFileReads"
                    effective={resolvedValue?.upload?.maxParallelFileReads}
                  />
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
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
                  />
                  <PolicyNumberInput
                    id="before-timeout"
                    title={t`Timeout - Before`}
                    description={t`Timeout in seconds before Kopia kills the process`}
                    form={form}
                    formKey="actions.beforeSnapshotRoot.timeout"
                    effective={resolvedValue?.actions?.beforeSnapshotRoot?.timeout}
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
                  />
                  <PolicyTextInput
                    id="after-snapshot"
                    title={t`After Snapshot`}
                    description={t`Script to run after snapshot`}
                    form={form}
                    formKey="actions.afterSnapshotRoot.script"
                    effective={resolvedValue?.actions?.afterSnapshotRoot?.script}
                  />
                  <PolicyNumberInput
                    id="after-timeout"
                    title={t`Timeout - After`}
                    description={t`Timeout in seconds before Kopia kills the process`}
                    form={form}
                    formKey="actions.afterSnapshotRoot.timeout"
                    effective={resolvedValue?.actions?.afterSnapshotRoot?.timeout}
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
                  />
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
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
            <TabsPanel value="other" px="xs">
              <ScrollAreaAutosize mah={600} scrollbarSize={4}>
                <Accordion variant="contained">
                  <AccordionItem value="disable-parent-policy-eval">
                    <PolicyAccordionControl
                      title={t`Disable Parent Policy Evaluation`}
                      description={t`Prevents any parent policies from affecting this directory and its subdirectories`}
                      isConfigured={form.values.noParent !== undefined}
                    />
                    <AccordionPanel>
                      <Switch
                        label={t`Disable Parent Policy`}
                        {...form.getInputProps("noParent", {
                          type: "checkbox"
                        })}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem value="json-policy">
                    <PolicyAccordionControl
                      title={t`JSON Representation`}
                      description={t`This is the internal representation of a policy`}
                      isConfigured={true}
                    />
                    <AccordionPanel>
                      <JsonInput rows={10} value={JSON.stringify(form.values, null, 2)} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </ScrollAreaAutosize>
            </TabsPanel>
          </Tabs>
        </Stack>
      </form>

      <Group className={modalClasses.footer}>
        <Button size="xs" color="gray" variant="subtle" onClick={onCancel} disabled={false}>
          <Trans>Cancel</Trans>
        </Button>
        <Group>
          {!isNew && !isGlobal && onDeleted && <DeletePolicyButton sourceInfo={target} onDeleted={onDeleted} />}
          <Button size="xs" type="submit" form="update-policy-form" loading={false} disabled={!form.isValid()}>
            <Trans>Save</Trans>
          </Button>
        </Group>
      </Group>
    </Modal>
  );
}
