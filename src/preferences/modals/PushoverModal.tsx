import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, Group, Modal, PasswordInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import { ErrorAlert } from "../../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../../core/hooks/useApiRequest";
import type { NotificationProfile, PushOverNotification } from "../../core/types";
import modalClasses from "../../styles/modals.module.css";
import modalBaseStyles from "../../styles/modalStyles";

type Props = {
  profile?: NotificationProfile;
  onCancel: () => void;
  onSaved: (profile: NotificationProfile, isCreate: boolean) => void;
};

const schema = Yup.object({
  name: Yup.string().required().label("Name"),
  minSeverity: Yup.string().required().label("Severity"),
  appToken: Yup.string().required().label("App Token"),
  userKey: Yup.string().required().label("User key")
});

type PushoverForm = {
  name: string;
  minSeverity: string;
  format: string;
  appToken: string;
  userKey: string;
  endpoint?: string;
};

export default function PushoverModal({ onCancel, onSaved, profile }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const getForm = () => {
    if (profile === undefined) {
      return {
        name: "",
        minSeverity: "0",
        format: "txt",
        appToken: "",
        userKey: "",
        endpoint: undefined
      } satisfies PushoverForm;
    } else {
      const config = profile.method.config as PushOverNotification;

      return {
        name: profile.profile,
        format: profile.method.config.format,
        minSeverity: profile.minSeverity.toString(),
        appToken: config.appToken,
        userKey: config.userKey,
        endpoint: config.endpoint
      } satisfies PushoverForm;
    }
  };
  const form = useForm<PushoverForm, (values: PushoverForm) => NotificationProfile>({
    mode: "controlled",
    initialValues: getForm(),
    validate: yupResolver(schema),
    transformValues(values: PushoverForm): NotificationProfile {
      const base: NotificationProfile = {
        profile: values.name,
        minSeverity: parseInt(values.minSeverity),
        method: {
          type: "pushover",
          config: {
            appToken: values.appToken,
            userKey: values.userKey,
            endpoint: values.endpoint,
            format: values.format
          } as PushOverNotification
        }
      };
      return base;
    }
  });

  const { error, loading, execute } = useApiRequest({
    action: (data?: NotificationProfile) =>
      // Create and update uses the same
      kopiaService.createNotificationProfile(data!),
    onReturn: (g) => {
      onSaved(g, profile === undefined);
    }
  });
  async function submitForm(values: NotificationProfile) {
    await execute(values);
  }

  return (
    <Modal
      title={profile === undefined ? t`Create pushover notification` : t`Edit pushover notification`}
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="lg"
    >
      <form id="pushover-form" onSubmit={form.onSubmit(submitForm)} className={modalClasses.container}>
        <Stack w="100%">
          <ErrorAlert error={error} />

          <TextInput
            label={t`Name`}
            description={t`Unique name for this notification profile`}
            placeholder="pushover-1"
            withAsterisk
            disabled={profile !== undefined}
            {...form.getInputProps("name")}
          />
          <Select
            label={t`Minimum Severity`}
            description={t`Minimum severity required to use this notification profile`}
            data={[
              { label: "Verbose", value: "-100" },
              { label: "Success", value: "-10" },
              { label: "Report", value: "0" },
              { label: "Warning", value: "10" },
              { label: "Error", value: "20" }
            ]}
            withAsterisk
            allowDeselect={false}
            withCheckIcon={false}
            {...form.getInputProps("minSeverity")}
          />

          <PasswordInput label={t`Pushover App Token`} withAsterisk {...form.getInputProps("appToken")} />
          <TextInput label={t`Recipient User Key or Group Key`} withAsterisk {...form.getInputProps("userKey")} />
          <TextInput label={t`Endpoint`} withAsterisk {...form.getInputProps("endpoint")} />
          <Select
            label={`Notification Format`}
            data={[
              { label: t`Plain Text Format`, value: "txt" },
              { label: t`HTML Format`, value: "html" }
            ]}
            withAsterisk
            allowDeselect={false}
            withCheckIcon={false}
            {...form.getInputProps("format")}
          />
        </Stack>
      </form>

      <Group className={modalClasses.footer}>
        <Button size="xs" color="gray" variant="subtle" onClick={onCancel} disabled={loading}>
          <Trans>Cancel</Trans>
        </Button>
        <Button size="xs" type="submit" form="pushover-form" loading={loading} disabled={!form.isValid()}>
          {profile === undefined ? t`Create` : t`Save`}
        </Button>
      </Group>
    </Modal>
  );
}
