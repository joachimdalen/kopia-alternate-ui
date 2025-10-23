import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import { ErrorAlert } from "../../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../../core/hooks/useApiRequest";
import kopiaService from "../../core/kopiaService";
import type { Snapshot } from "../../core/types";
import modalClasses from "../../styles/modals.module.css";
import modalBaseStyles from "../../styles/modalStyles";
type Props = {
  oid: string;
  onCancel: () => void;
  onUpdated: (snapshots: Snapshot[]) => void;
};

const schema = Yup.object({
  description: Yup.string().max(250).label("Description"),
});

type SetDescriptionForm = {
  description: string;
};

export default function RestoreModal({ oid, onCancel, onUpdated }: Props) {
  const form = useForm<SetDescriptionForm>({
    mode: "controlled",
    initialValues: {
      description: "",
    },
    validate: yupResolver(schema),
  });

  const { error, loading, execute } = useApiRequest({
    action: (data?: SetDescriptionForm) =>
      kopiaService.updateDescription([], data!.description!),
    onReturn: (g) => {
      onUpdated(g);
    },
  });
  async function submitForm(values: SetDescriptionForm) {
    await execute(values);
  }
  return (
    <Modal
      title="Restore files and directories"
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="lg"
    >
      <form
        id="update-description-form"
        onSubmit={form.onSubmit(submitForm)}
        className={modalClasses.container}
      >
        <Stack w="100%">
          <ErrorAlert error={error} />

          <TextInput
            label="Destination"
            description="You can also restore to a .zip or .tar file by providing the appropriate extension."
            placeholder="Enter destination path"
            withAsterisk
            {...form.getInputProps("description")}
          />
          <Accordion variant="separated">
            <AccordionItem value="options">
              <AccordionControl>Options</AccordionControl>
              <AccordionPanel>
                <Stack>
                  <Switch
                    label="Skip previously restored files and symlinks"
                    color="green"
                  />

                  <Switch
                    label="Continue on Errors"
                    description="When a restore error occurs, attempt to continue instead of failing fast."
                    color="green"
                  />
                  <Switch label="Restore File Ownership" color="green" />
                  <Switch label="Restore File Permissions" color="green" />
                  <Switch
                    label="Restore File Modification Time"
                    color="green"
                  />
                  <Switch label="Overwrite Files" color="green" />
                  <Switch label="Overwrite Directories" color="green" />
                  <Switch label="Overwrite Symbolic Links" color="green" />
                  <Switch label="Write files atomically" color="green" />
                  <Switch label="Write Sparse Files" color="green" />
                  <Divider />
                  <Group wrap="nowrap" grow>
                    <NumberInput label="Shallow Restore At Depth" />
                    <NumberInput label="Minimal File Size For Shallow Restore" />
                  </Group>
                  <Switch
                    label="Disable ZIP compression"
                    description="Do not compress when restoring to a ZIP file (faster)."
                    color="green"
                  />
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
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
          form="update-description-form"
          loading={loading || !form.isValid()}
        >
          Begin Restore
        </Button>
      </Group>
    </Modal>
  );
}
