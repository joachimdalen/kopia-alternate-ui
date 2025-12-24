import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
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
import type { EmailNotification, NotificationProfile } from "../../core/types";
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
  smtpServer: Yup.string().required().label("SMTP Server"),
  smtpUsername: Yup.string().required().label("SMTP Username"),
  smtpPassword: Yup.string().required().label("SMTP Password"),
  from: Yup.string().required().label("From"),
});

type EmailForm = {
  name: string;
  minSeverity: string;
  smtpServer: string;
  smtpPort: number;
  smtpIdentity?: string;
  smtpUsername: string;
  smtpPassword: string;
  from: string;
  to: EmailKeyValue[];
  cc: EmailKeyValue[];
  format: string;
};

type EmailKeyValue = {
  id: string;
  value: string;
};

export default function EmailModal({ onCancel, onSaved, profile }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const getForm = () => {
    if (profile === undefined) {
      return {
        name: "",
        minSeverity: "0",
        smtpServer: "",
        smtpPort: 587,
        smtpIdentity: undefined,
        smtpUsername: "",
        smtpPassword: "",
        from: "",
        to: [],
        cc: [],
        format: "txt",
      };
    } else {
      const config = profile.method.config as EmailNotification;

      return {
        name: profile.profile,
        format: profile.method.config.format,
        minSeverity: profile.minSeverity.toString(),
        smtpServer: config.smtpServer,
        smtpPort: config.smtpPort,
        smtpIdentity: config.smtpIdentity,
        smtpUsername: config.smtpUsername,
        smtpPassword: config.smtpPassword,
        from: config.from,
        to:
          config.to?.split(",").map((v) => {
            return {
              id: randomId(),
              value: v,
            };
          }) || [],
        cc:
          config.cc?.split(",").map((v) => {
            return {
              id: randomId(),
              value: v,
            };
          }) || [],
      };
    }
  };
  const form = useForm<EmailForm, (values: EmailForm) => NotificationProfile>({
    mode: "controlled",
    initialValues: getForm(),
    validate: yupResolver(schema),
    transformValues(values: EmailForm): NotificationProfile {
      const base: NotificationProfile = {
        profile: values.name,
        minSeverity: parseInt(values.minSeverity),
        method: {
          type: "email",
          config: {
            smtpServer: values.smtpServer,
            smtpPort: values.smtpPort,
            smtpIdentity: values.smtpIdentity,
            smtpUsername: values.smtpUsername,
            smtpPassword: values.smtpPassword,
            cc: values.cc.map((x) => x.value).join(","),
            to: values.to.map((x) => x.value).join(","),
            format: values.format,
            from: values.from,
          } as EmailNotification,
        },
      };
      return base;
    },
  });

  const { error, loading, execute } = useApiRequest({
    action: (data?: NotificationProfile) =>
      // Create and update uses the same
      kopiaService.createNotificationProfile(data!),
    onReturn: (g) => {
      onSaved(g, profile === undefined);
    },
  });
  async function submitForm(values: NotificationProfile) {
    await execute(values);
  }

  const toFields = form.getValues().to.map((item, index) => (
    <Group key={item.id} mt="xs">
      <TextInput
        placeholder="Value"
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`to.${index}.value`)}
        {...form.getInputProps(`to.${index}.value`)}
      />
      <ActionIcon color="red" onClick={() => form.removeListItem("to", index)}>
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  ));
  const ccFields = form.getValues().cc.map((item, index) => (
    <Group key={item.id} mt="xs">
      <TextInput
        placeholder="Value"
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`cc.${index}.value`)}
        {...form.getInputProps(`cc.${index}.value`)}
      />
      <ActionIcon color="red" onClick={() => form.removeListItem("cc", index)}>
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  ));

  return (
    <Modal
      title={
        profile === undefined
          ? t`Create email notification`
          : t`Edit email notification`
      }
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="lg"
    >
      <form
        id="email-form"
        onSubmit={form.onSubmit(submitForm)}
        className={modalClasses.container}
      >
        <Stack w="100%">
          <ErrorAlert error={error} />

          <TextInput
            label={t`Name`}
            description={t`Unique name for this notification profile`}
            placeholder="email-1"
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
              { label: "Error", value: "20" },
            ]}
            withAsterisk
            allowDeselect={false}
            withCheckIcon={false}
            {...form.getInputProps("minSeverity")}
          />
          <Group grow>
            <TextInput
              label={t`SMTP Server`}
              placeholder={t`SMTP server DNS name, e.g. smtp.gmail.com`}
              withAsterisk
              {...form.getInputProps("smtpServer")}
            />
            <NumberInput
              label={t`SMTP Port`}
              withAsterisk
              hideControls
              {...form.getInputProps("smtpPort")}
            />
          </Group>
          <Group grow>
            <TextInput
              label={t`SMTP Username`}
              placeholder={t`SMTP server username, typically the email address`}
              withAsterisk
              {...form.getInputProps("smtpUsername")}
            />
            <PasswordInput
              label={t`SMTP server password`}
              withAsterisk
              {...form.getInputProps("smtpPassword")}
            />
          </Group>
          <TextInput
            label={t`Mail From`}
            placeholder={t`sender email address`}
            withAsterisk
            {...form.getInputProps("from")}
          />
          <Select
            label={t`Notification Format`}
            data={[
              { label: t`Plain Text Format`, value: "txt" },
              { label: t`HTML Format`, value: "html" },
            ]}
            withAsterisk
            allowDeselect={false}
            withCheckIcon={false}
            {...form.getInputProps("format")}
          />
          <Fieldset legend={<Trans context="email-to">To</Trans>}>
            {toFields.length === 0 && (
              <Text c="dimmed" ta="center">
                <Trans>No recepients defined</Trans>
              </Text>
            )}

            {toFields}
            <Group justify="center" mt="md">
              <Button
                size="xs"
                variant="subtle"
                onClick={() =>
                  form.insertListItem("to", {
                    value: "",
                    id: randomId(),
                  })
                }
              >
                <Trans>Add</Trans>
              </Button>
            </Group>
          </Fieldset>
          <Fieldset legend="Cc">
            {ccFields.length === 0 && (
              <Text c="dimmed" ta="center">
                <Trans>No recepients defined</Trans>
              </Text>
            )}

            {ccFields}
            <Group justify="center" mt="md">
              <Button
                size="xs"
                variant="subtle"
                onClick={() =>
                  form.insertListItem("cc", {
                    value: "",
                    id: randomId(),
                  })
                }
              >
                <Trans>Add</Trans>
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
          <Trans>Cancel</Trans>
        </Button>
        <Button
          size="xs"
          type="submit"
          form="webhook-form"
          loading={loading}
          disabled={!form.isValid()}
        >
          {profile === undefined ? t`Create` : t`Save`}
        </Button>
      </Group>
    </Modal>
  );
}
