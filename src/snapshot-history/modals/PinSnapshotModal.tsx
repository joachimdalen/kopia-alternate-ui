import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
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
  pin?: string;
  onCancel: () => void;
  onUpdated: (snapshots: Snapshot[]) => void;
};

const schema = Yup.object({
  name: Yup.string().max(250).label("Name")
});

type PinSnapshotForm = {
  name: string;
};

export default function PinSnapshotModal({ snapshot, pin, onCancel, onUpdated }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const form = useForm<PinSnapshotForm>({
    mode: "controlled",
    initialValues: {
      name: pin || "do-not-delete"
    },
    validate: yupResolver(schema)
  });

  const { error, loading, execute } = useApiRequest({
    action: (data?: PinSnapshotForm) =>
      pin === undefined
        ? kopiaService.addPin(snapshot.id, data!.name!)
        : kopiaService.updatePin(snapshot.id, pin, data!.name!),
    onReturn: (g) => {
      onUpdated(g);
    }
  });

  const {
    error: deleteError,
    loading: deleteLoading,
    execute: deletePin
  } = useApiRequest({
    action: () => kopiaService.removePin(snapshot.id, pin!),
    onReturn: (g) => {
      onUpdated(g);
    }
  });
  async function submitForm(values: PinSnapshotForm) {
    await execute(values);
  }
  const intLoading = loading || deleteLoading;
  const intError = error || deleteError;
  return (
    <Modal
      title={t`Pin Snapshot`}
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
    >
      <form id="pin-snapshot-form" onSubmit={form.onSubmit(submitForm)} className={modalClasses.container}>
        <Stack w="100%">
          <ErrorAlert error={intError} />

          <TextInput label={t`Name of the pin`} withAsterisk {...form.getInputProps("name")} />
        </Stack>
      </form>

      <Group className={modalClasses.footer}>
        <Button size="xs" color="gray" variant="subtle" onClick={onCancel} disabled={intLoading}>
          <Trans>Cancel</Trans>
        </Button>
        <Group>
          {pin && (
            <Button size="xs" type="submit" color="red" loading={intLoading} onClick={() => deletePin()}>
              <Trans>Delete</Trans>
            </Button>
          )}
          <Button size="xs" type="submit" form="pin-snapshot-form" loading={intLoading} disabled={!form.isValid()}>
            <Trans>Save</Trans>
          </Button>
        </Group>
      </Group>
    </Modal>
  );
}
