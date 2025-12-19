import {
  Button,
  Fieldset,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import { ErrorAlert } from "../../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../../core/hooks/useApiRequest";
import type { RestoreRequest, Task } from "../../core/types";
import modalClasses from "../../styles/modals.module.css";
import modalBaseStyles from "../../styles/modalStyles";
type Props = {
  oid: string;
  onCancel: () => void;
  onRestoreStarted: (task: Task) => void;
};

const schema = Yup.object({
  description: Yup.string().max(250).label("Description"),
});

type RestoreForm = {
  type: "directory" | "zip" | "tar";
  incremental: boolean;
  continueOnErrors: boolean;
  restoreOwnership: boolean;
  restorePermissions: boolean;
  restoreModTimes: boolean;
  uncompressedZip: boolean;
  overwriteFiles: boolean;
  overwriteDirectories: boolean;
  overwriteSymlinks: boolean;
  ignorePermissionErrors: boolean;
  writeFilesAtomically: boolean;
  writeSparseFiles: boolean;
  restoreDirEntryAtDepth: number;
  minSizeForPlaceholder: number;
  restoreTask: string;
  destination?: string;
};

export default function RestoreModal({
  oid,
  onCancel,
  onRestoreStarted,
}: Props) {
  const { kopiaService } = useServerInstanceContext();
  const form = useForm<RestoreForm, (values: RestoreForm) => RestoreRequest>({
    mode: "controlled",
    initialValues: {
      destination: "",
      type: "directory",
      incremental: true,
      continueOnErrors: false,
      restoreOwnership: true,
      restorePermissions: true,
      restoreModTimes: true,
      uncompressedZip: true,
      overwriteFiles: false,
      overwriteDirectories: false,
      overwriteSymlinks: false,
      ignorePermissionErrors: true,
      writeFilesAtomically: false,
      writeSparseFiles: false,
      restoreDirEntryAtDepth: 1000,
      minSizeForPlaceholder: 0,
      restoreTask: "",
    },
    validate: yupResolver(schema),
    transformValues(values: RestoreForm): RestoreRequest {
      const base = {
        root: oid,
        options: {
          incremental: values.incremental,
          ignoreErrors: values.continueOnErrors,
          restoreDirEntryAtDepth: values.restoreDirEntryAtDepth,
          minSizeForPlaceholder: values.minSizeForPlaceholder,
        },
      };
      if (values.type === "zip") {
        return {
          ...base,
          zipFile: values.destination!,
          uncompressedZip: values.uncompressedZip,
        };
      }

      if (values.type === "tar") {
        return {
          ...base,
          tarFile: values.destination!,
        };
      }

      return {
        ...base,
        fsOutput: {
          targetPath: values.destination!,
          skipOwners: !values.restoreOwnership,
          skipPermissions: !values.restorePermissions,
          skipTimes: !values.restoreModTimes,
          ignorePermissionErrors: values.ignorePermissionErrors,
          overwriteFiles: values.overwriteFiles,
          overwriteDirectories: values.overwriteDirectories,
          overwriteSymlinks: values.overwriteSymlinks,
          writeFilesAtomically: values.writeFilesAtomically,
          writeSparseFiles: values.writeSparseFiles,
        },
      };
    },
  });

  const { error, loading, execute } = useApiRequest({
    action: (data?: RestoreRequest) => kopiaService.restore(data!),
    onReturn: (g) => {
      onRestoreStarted(g);
    },
  });
  async function submitForm(values: RestoreRequest) {
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
          <SegmentedControl
            withItemsBorders
            data={[
              { label: "Directory", value: "directory" },
              { label: "Zip File", value: "zip" },
              { label: "Tar File", value: "tar" },
            ]}
            {...form.getInputProps("type")}
          />

          <TextInput
            label="Destination"
            description="You can also restore to a .zip or .tar file by providing the appropriate extension."
            placeholder="Enter destination path"
            rightSection={
              form.values.type !== "directory" && (
                <Text span mr="5">
                  {form.values.type === "zip" ? ".zip" : ".tar"}
                </Text>
              )
            }
            withAsterisk
            {...form.getInputProps("destination")}
          />
          <Fieldset legend="General Options">
            <Stack>
              <Switch
                label="Skip previously restored files and symlinks"
                color="green"
                {...form.getInputProps("incremental", { type: "checkbox" })}
              />
              <Switch
                label="Continue on Errors"
                description="When a restore error occurs, attempt to continue instead of failing fast."
                color="green"
                {...form.getInputProps("continueOnErrors", {
                  type: "checkbox",
                })}
              />
              <Group wrap="nowrap" grow>
                <NumberInput
                  label="Shallow Restore At Depth"
                  min={0}
                  {...form.getInputProps("restoreDirEntryAtDepth")}
                />
                <NumberInput
                  label="Minimal File Size For Shallow Restore"
                  min={0}
                  {...form.getInputProps("minSizeForPlaceholder")}
                />
              </Group>
            </Stack>
          </Fieldset>

          {form.values.type === "directory" && (
            <Fieldset legend="Directory Options">
              <Stack>
                <Switch
                  label="Restore File Ownership"
                  color="green"
                  {...form.getInputProps("restoreOwnership", {
                    type: "checkbox",
                  })}
                />
                <Switch
                  label="Restore File Permissions"
                  color="green"
                  {...form.getInputProps("restorePermissions", {
                    type: "checkbox",
                  })}
                />
                <Switch
                  label="Restore File Modification Time"
                  color="green"
                  {...form.getInputProps("restoreModTimes", {
                    type: "checkbox",
                  })}
                />
                <Switch
                  label="Overwrite Files"
                  color="green"
                  {...form.getInputProps("overwriteFiles", {
                    type: "checkbox",
                  })}
                />
                <Switch
                  label="Overwrite Directories"
                  color="green"
                  {...form.getInputProps("overwriteDirectories", {
                    type: "checkbox",
                  })}
                />
                <Switch
                  label="Overwrite Symbolic Links"
                  color="green"
                  {...form.getInputProps("overwriteSymlinks", {
                    type: "checkbox",
                  })}
                />
                <Switch
                  label="Write files atomically"
                  color="green"
                  {...form.getInputProps("writeFilesAtomically", {
                    type: "checkbox",
                  })}
                />
                <Switch
                  label="Write Sparse Files"
                  color="green"
                  {...form.getInputProps("writeSparseFiles", {
                    type: "checkbox",
                  })}
                />
              </Stack>
            </Fieldset>
          )}
          {form.values.type === "zip" && (
            <Fieldset legend="Zip options">
              <Switch
                label="Disable ZIP compression"
                description="Do not compress when restoring to a ZIP file (faster)."
                color="green"
                {...form.getInputProps("uncompressedZip", { type: "checkbox" })}
              />
            </Fieldset>
          )}
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
          loading={loading}
          disabled={!form.isValid()}
        >
          Begin Restore
        </Button>
      </Group>
    </Modal>
  );
}
