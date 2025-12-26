import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, Group, Modal, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import { ErrorAlert } from "../../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../../core/hooks/useApiRequest";
import type { Snapshot } from "../../core/types";
import modalBaseStyles from "../../styles/modalStyles";
import modalClasses from "../../styles/modals.module.css";

type Props = {
  snapshot: Snapshot;
  onCancel: () => void;
  onUpdated: (snapshots: Snapshot[]) => void;
};

const schema = Yup.object({
  description: Yup.string().max(250).label("Description")
});

type SetDescriptionForm = {
  description: string;
};

export default function UpdateDescriptionModal({ snapshot, onCancel, onUpdated }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const form = useForm<SetDescriptionForm>({
    mode: "controlled",
    initialValues: {
      description: snapshot.description || ""
    },
    validate: yupResolver(schema),
    validateInputOnBlur: true
  });

  const { error, loading, execute } = useApiRequest({
    action: (data?: SetDescriptionForm) => kopiaService.updateDescription([snapshot.id], data!.description!),
    onReturn: (g) => {
      onUpdated(g);
    }
  });
  async function submitForm(values: SetDescriptionForm) {
    await execute(values);
  }
  return (
    <Modal
      title={t`Update description`}
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
    >
      <form id="update-description-form" onSubmit={form.onSubmit(submitForm)} className={modalClasses.container}>
        <Stack w="100%">
          <ErrorAlert error={error} />

          <Textarea
            label={t`Description`}
            description={t`Leave empty to remove description`}
            withAsterisk
            {...form.getInputProps("description")}
          />
        </Stack>
      </form>

      <Group className={modalClasses.footer}>
        <Button size="xs" color="gray" variant="subtle" onClick={onCancel} disabled={loading}>
          <Trans>Cancel</Trans>
        </Button>
        <Button size="xs" type="submit" form="update-description-form" loading={loading} disabled={!form.isValid()}>
          <Trans>Save</Trans>
        </Button>
      </Group>
    </Modal>
  );
}
