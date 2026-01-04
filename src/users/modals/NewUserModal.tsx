import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, Group, Modal, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import { ErrorAlert } from "../../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../../core/hooks/useApiRequest";
import type { CreateProfileRequest, Profile } from "../../core/types";
import modalBaseStyles from "../../styles/modalStyles";
import modalClasses from "../../styles/modals.module.css";

type Props = {
  onCancel: () => void;
  onCreated: (user: Profile) => void;
};

const schema = Yup.object({
  name: Yup.string()
    .trim()
    .matches(/^[a-z0-9\-_.]+$/, t`Name can only contain lowercase letters, numbers, dashes, underscore and period`)
    .required()
    .label(t`Name`),
  hostname: Yup.string()
    .trim()
    .matches(/^[a-z0-9\-_.]+$/, t`Hostname can only contain lowercase letters, numbers, dashes, underscore and period`)
    .required()
    .label(t`Hostname`),
  password: Yup.string().trim().required().label(t`Password`),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], t`Passwords must match`)
    .required()
});

type AddUserForm = {
  name: string;
  hostname: string;
  password: string;
  passwordConfirmation: string;
};

export default function NewUserModal({ onCancel, onCreated }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const form = useForm<AddUserForm, (values: AddUserForm) => CreateProfileRequest>({
    mode: "controlled",
    initialValues: {
      name: "",
      hostname: "",
      password: "",
      passwordConfirmation: ""
    },
    validateInputOnBlur: true,
    validate: yupResolver(schema),
    transformValues(values) {
      return {
        username: `${values.name}@${values.hostname}`,
        password: values.password
      } satisfies CreateProfileRequest;
    }
  });

  const addUserAction = useApiRequest({
    action: (data?: CreateProfileRequest) => kopiaService.addUser(data!),
    onReturn: (g) => {
      onCreated(g);
    }
  });

  async function submitForm(values: CreateProfileRequest) {
    await addUserAction.execute(values);
  }

  return (
    <Modal
      title={t`Create user`}
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
    >
      <form id="create-user-form" onSubmit={form.onSubmit(submitForm)} className={modalClasses.container}>
        <Stack w="100%">
          <ErrorAlert error={addUserAction.error} />

          <Group grow align="flex-start">
            <TextInput label={t`Name`} withAsterisk placeholder="Enter name of user" {...form.getInputProps("name")} />
            <TextInput
              label={t`Hostname`}
              withAsterisk
              placeholder="Enter hostname"
              {...form.getInputProps("hostname")}
            />
          </Group>

          <PasswordInput
            label={t`Password`}
            withAsterisk
            placeholder="Enter password for user"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label={t`Confirm password`}
            withAsterisk
            placeholder="Confirm password for user"
            {...form.getInputProps("passwordConfirmation")}
          />
        </Stack>
      </form>

      <Group className={modalClasses.footer}>
        <Button size="xs" color="gray" variant="subtle" onClick={onCancel} disabled={addUserAction.loading}>
          <Trans>Cancel</Trans>
        </Button>
        <Button
          size="xs"
          type="submit"
          form="create-user-form"
          loading={addUserAction.loading}
          disabled={!form.isValid()}
        >
          <Trans>Save</Trans>
        </Button>
      </Group>
    </Modal>
  );
}
