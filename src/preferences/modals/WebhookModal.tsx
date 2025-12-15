import { Button, Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import { ErrorAlert } from "../../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../../core/hooks/useApiRequest";
import kopiaService from "../../core/kopiaService";
import type {
  NotificationProfile,
  WebhookNotification,
} from "../../core/types";
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
  endpoint: Yup.string().required().label("Endpoint"),
  method: Yup.string().required().label("Method"),
  format: Yup.string().required().label("Format"),
});

type WebhookForm = {
  name: string;
  minSeverity: string;
  endpoint: string;
  method: string;
  format: string;
  headers: {
    name: string;
    value: string;
  }[];
};

export default function WebhookModal({ onCancel, onSaved, profile }: Props) {
  const getForm = () => {
    if (profile === undefined) {
      return {
        name: "",
        minSeverity: "0",
        endpoint: "",
        format: "txt",
        method: "POST",
        headers: [],
      };
    } else {
      const config = profile.method.config as WebhookNotification;

      let headers: {
        name: string;
        value: string;
      }[] = [];
      if (config.headers) {
        headers = config.headers.split("\n").map((l) => {
          const p = l.split(":");
          return {
            name: p[0],
            value: p[1],
          };
        });
      }

      return {
        name: profile.profile,
        endpoint: config.endpoint,
        method: config.method,
        format: profile.method.config.format,
        minSeverity: profile.minSeverity.toString(),
        headers: headers,
      };
    }
  };
  const form = useForm<
    WebhookForm,
    (values: WebhookForm) => NotificationProfile
  >({
    mode: "controlled",
    initialValues: getForm(),
    validate: yupResolver(schema),
    transformValues(values: WebhookForm): NotificationProfile {
      const base: NotificationProfile = {
        profile: values.name,
        minSeverity: parseInt(values.minSeverity),
        method: {
          type: "webhook",
          config: {
            endpoint: values.endpoint,
            format: values.format,
            headers: values.headers
              .map((h) => `${h.name}: ${h.value}`)
              .join("\n"),
            method: values.method,
          } as WebhookNotification,
        },
      };
      return base;
    },
  });

  const { error, loading, execute } = useApiRequest({
    action: (data?: NotificationProfile) =>
      kopiaService.createNotificationProfile(data!),
    onReturn: (g) => {
      onSaved(g, profile === undefined);
    },
  });
  async function submitForm(values: NotificationProfile) {
    await execute(values);
  }
  return (
    <Modal
      title={
        profile === undefined
          ? "Create webhook notification"
          : "Edit webhook notification"
      }
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="lg"
    >
      <form
        id="webhook-form"
        onSubmit={form.onSubmit(submitForm)}
        className={modalClasses.container}
      >
        <Stack w="100%">
          <ErrorAlert error={error} />

          <TextInput
            label="Name"
            description="Unique name for this notification profile"
            placeholder="webhook-1"
            withAsterisk
            disabled={profile !== undefined}
            {...form.getInputProps("name")}
          />
          <Select
            label="Minimum Severity"
            description="Minimum severity required to use this notification profile"
            data={[
              { label: "Verbose", value: "-100" },
              { label: "Success", value: "-10" },
              { label: "Report", value: "0" },
              { label: "Warning", value: "10" },
              { label: "Error", value: "20" },
            ]}
            withAsterisk
            allowDeselect={false}
            withCheckIcon={false}
            {...form.getInputProps("minSeverity")}
          />
          <TextInput
            label="URL Endpoint"
            withAsterisk
            {...form.getInputProps("endpoint")}
          />
          <Group grow>
            <Select
              label="HTTP Method"
              data={[
                { label: "POST", value: "POST" },
                { label: "PUT", value: "PUT" },
              ]}
              withAsterisk
              allowDeselect={false}
              withCheckIcon={false}
              {...form.getInputProps("method")}
            />
            <Select
              label="Notification Format"
              data={[
                { label: "Plain Text Format", value: "txt" },
                { label: "HTML Format", value: "html" },
              ]}
              withAsterisk
              allowDeselect={false}
              withCheckIcon={false}
              {...form.getInputProps("format")}
            />
          </Group>
        </Stack>
      </form>

      <Group className={modalClasses.footer}>
        <Button
          size="xs"
          color="gray"
          variant="subtle"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          size="xs"
          type="submit"
          form="webhook-form"
          loading={loading}
          disabled={!form.isValid()}
        >
          {profile === undefined ? "Create" : "Save"}
        </Button>
      </Group>
    </Modal>
  );
}
