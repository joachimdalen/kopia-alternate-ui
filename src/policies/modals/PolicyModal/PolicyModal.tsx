import { Trans } from "@lingui/react/macro";
import { Button, Group, LoadingOverlay, Modal, Stack, Tabs, TabsList, TabsTab } from "@mantine/core";
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
import { useServerInstanceContext } from "../../../core/context/ServerInstanceContext";
import { ErrorAlert } from "../../../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../../../core/hooks/useApiRequest";
import IconWrapper from "../../../core/IconWrapper";
import type { Policy, ResolvedPolicy, SourceInfo } from "../../../core/types";
import modalBaseStyles from "../../../styles/modalStyles";
import modalClasses from "../../../styles/modals.module.css";
import { getPolicyType } from "../../policiesUtil";
import DeletePolicyButton from "./components/DeletePolicyButton";
import CompressionTab from "./tabs/CompressionTab";
import ErrorHandlingTab from "./tabs/ErrorHandlingTab";
import FilesTab from "./tabs/FilesTab";
import FolderActionsTab from "./tabs/FolderActionsTab";
import LoggingTab from "./tabs/LoggingTab";
import OtherTab from "./tabs/OtherTab";
import SchedulingTab from "./tabs/SchedulingTab";
import SnapshotActionsTab from "./tabs/SnapshotActionsTab";
import SnapshotRetentionTab from "./tabs/SnapshotRetentionTab";
import UploadTab from "./tabs/UploadTab";
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
            <SnapshotRetentionTab form={form} resolvedValue={resolvedValue} />
            <FilesTab form={form} resolvedValue={resolvedValue} />
            <ErrorHandlingTab form={form} resolvedValue={resolvedValue} />
            <CompressionTab form={form} resolvedValue={resolvedValue} />
            <SchedulingTab
              form={form}
              resolvedValue={resolvedValue}
              upcomingSnapshotTimes={resolved?.upcomingSnapshotTimes}
            />
            <UploadTab form={form} resolvedValue={resolvedValue} />
            <SnapshotActionsTab form={form} resolvedValue={resolvedValue} />
            <FolderActionsTab form={form} resolvedValue={resolvedValue} />
            <LoggingTab form={form} resolvedValue={resolvedValue} />
            <OtherTab form={form} />
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
