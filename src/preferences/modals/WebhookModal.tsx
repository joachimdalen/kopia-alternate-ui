import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import { ErrorAlert } from "../../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../../core/hooks/useApiRequest";
import type {
  NotificationProfile,
  WebhookNotification,
} from "../../core/types";
import modalClasses from "../../styles/modals.module.css";
import modalBaseStyles from "../../styles/modalStyles";
type Props = {
  profile?: NotificationProfile;
  onCancel: () => void;
  onSaved: () => void;
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
  headers: WebhookHeader[];
};
type WebhookHeader = {
  id: string;
  name: string;
  value: string;
};

export default function WebhookModal({ onCancel, onSaved, profile }: Props) {
  const { kopiaService } = useServerInstanceContext();
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

      let headers: WebhookHeader[] = [];
      if (config.headers) {
        headers = config.headers.split("\n").map((l) => {
          const p = l.split(":");
          return {
            id: randomId(),
            name: p[0].trimEnd(),
            value: p[1].trimStart(),
          } satisfies WebhookHeader;
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
      // Create and update uses the same
      kopiaService.createNotificationProfile(data!),
    onReturn: () => {
      onSaved();
    },
  });
  async function submitForm(values: NotificationProfile) {
    await execute(values);
  }

  const fields = form.getValues().headers.map((item, index) => (
    <Group key={item.id} mt="xs">
      <TextInput
        placeholder="Name"
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`headers.${index}.name`)}
        {...form.getInputProps(`headers.${index}.name`)}
      />
      <TextInput
        placeholder="Value"
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`headers.${index}.value`)}
        {...form.getInputProps(`headers.${index}.value`)}
      />
      <ActionIcon
        color="red"
        onClick={() => form.removeListItem("headers", index)}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  ));
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

          <Fieldset legend="Headers">
            {fields.length === 0 && (
              <Text c="dimmed" ta="center">
                No headers defined
              </Text>
            )}

            {fields}
            <Group justify="center" mt="md">
              <Button
                size="xs"
                variant="subtle"
                onClick={() =>
                  form.insertListItem("headers", {
                    name: "",
                    value: "",
                    id: randomId(),
                  })
                }
              >
                Add
              </Button>
            </Group>
          </Fieldset>
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
