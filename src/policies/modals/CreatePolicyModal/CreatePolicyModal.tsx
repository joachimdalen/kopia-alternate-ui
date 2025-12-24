import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Alert,
  Anchor,
  Button,
  Code,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { ErrorAlert } from "../../../core/ErrorAlert/ErrorAlert";
import { useServerInstanceContext } from "../../../core/context/ServerInstanceContext";
import useApiRequest, {
  type ErrorInformation,
} from "../../../core/hooks/useApiRequest";
import { type Policy, type SourceInfo } from "../../../core/types";
import modalBaseStyles from "../../../styles/modalStyles";
import modalClasses from "../../../styles/modals.module.css";
import { formatOwnerName } from "../../../utils/formatOwnerName";
import { checkPolicyPath } from "../../policiesUtil";

type Props = {
  localUserName: string;
  localHost: string;
  onCancel: () => void;
  onEdit: (target: SourceInfo, isNew: boolean) => void;
};

type Form = {
  path: string;
};

export default function CreatePolicyModal({
  localHost,
  localUserName,
  onCancel,
  onEdit,
}: Props) {
  const { kopiaService } = useServerInstanceContext();
  const form = useForm<Form>({
    mode: "controlled",
    initialValues: {
      path: "",
    },
    validate: {
      path: (value) => checkPolicyPath(value),
    },
    validateInputOnBlur: true,
  });
  const [policy, setPolicy] = useState<Policy>();

  const { error, loading, execute } = useApiRequest({
    action: (data?: Form) =>
      kopiaService.getPolicy({
        host: localHost,
        userName: localUserName,
        path: data!.path,
      }),
    onReturn: (g) => {
      setPolicy(g);
    },
    handleError: (g: ErrorInformation, d?: Form) => {
      if (g.data != undefined) {
        const intd = g.data as { code: string; error: string };
        if (intd.code === "NOT_FOUND") {
          onEdit(
            {
              userName: localUserName,
              host: localHost,
              path: d!.path!,
            },
            true
          );
          return false;
        }
      }
      return true;
    },
  });
  async function submitForm(values: Form) {
    await execute(values);
  }
  return (
    <Modal
      title={t`Create policy`}
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
    >
      <form
        id="create-policy-form"
        onSubmit={form.onSubmit(submitForm)}
        className={modalClasses.container}
      >
        <Stack w="100%">
          <ErrorAlert error={error} />
          {policy && (
            <Alert color="yellow" title="Policy Exists">
              <Text fz="xs">
                Found an existing policy for{" "}
                <Code>
                  {formatOwnerName({
                    host: localHost,
                    userName: localUserName,
                    path: "",
                  })}
                  :{form.values.path}
                </Code>{" "}
                -{" "}
                <Anchor
                  fz="xs"
                  onClick={() => {
                    onEdit(
                      {
                        userName: localUserName,
                        host: localHost,
                        path: form.values.path!,
                      },
                      false
                    );
                  }}
                >
                  <Trans>Edit existing policy</Trans>
                </Anchor>
              </Text>
            </Alert>
          )}
          <TextInput
            label={t`Path`}
            withAsterisk
            description={t`Directory to create policy for`}
            disabled={policy !== undefined}
            {...form.getInputProps("path")}
          />
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
          form="create-policy-form"
          loading={loading}
          disabled={!form.isValid()}
        >
          <Trans>Create</Trans>
        </Button>
      </Group>
    </Modal>
  );
}
