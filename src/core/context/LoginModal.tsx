import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, Group, Modal, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import modalClasses from "../../styles/modals.module.css";
import modalBaseStyles from "../../styles/modalStyles";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import type { ErrorInformation } from "../hooks/useApiRequest";
import type { Instance } from "../uiService";
type Props = {
  error?: ErrorInformation;
  onLogin: (username: string, password: string) => void;
  instance?: Instance;
};

const schema = Yup.object({
  username: Yup.string().required().label("Username"),
  password: Yup.string().required().label("Password")
});

type LoginForm = {
  username: string;
  password: string;
};

export default function LoginModal({ instance, onLogin, error }: Props) {
  const form = useForm<LoginForm>({
    mode: "controlled",
    initialValues: {
      username: "",
      password: ""
    },
    validate: yupResolver(schema),
    validateInputOnBlur: true
  });

  async function submitForm(values: LoginForm) {
    onLogin(values.username, values.password);
  }

  const instanceName = instance?.name || "Unknown";

  return (
    <Modal
      title={t`Login to ${instanceName}`}
      onClose={() => console.log()}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <form id="login-form" onSubmit={form.onSubmit(submitForm)} className={modalClasses.container}>
        <Stack w="100%">
          <ErrorAlert error={error} />
          <TextInput
            label={<Trans>Username</Trans>}
            withAsterisk
            placeholder={t`Username`}
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label={<Trans>Password</Trans>}
            placeholder={t`Password`}
            withAsterisk
            {...form.getInputProps("password")}
          />
        </Stack>
      </form>

      <Group
        className={modalClasses.footer}
        styles={{
          root: {
            justifyContent: "flex-end"
          }
        }}
      >
        <Button size="xs" type="submit" form="login-form" disabled={!form.isValid()}>
          <Trans>Login</Trans>
        </Button>
      </Group>
    </Modal>
  );
}
