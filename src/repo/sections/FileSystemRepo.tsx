import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Group, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconFolderOpen } from "@tabler/icons-react";
import { type ObjectSchema, object, string } from "yup";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<FileSystemRepoConfig>>;
};

export type FileSystemRepoConfig = {
  path: string;
};

export const fileSystemRepoConfigDefault: FileSystemRepoConfig = {
  path: ""
};

export const fileSystemRepoConfigSchema = (): ObjectSchema<FileSystemRepoConfig> =>
  object({
    path: string().required().label(t`Directory Path`)
  });

export function FileSystemRepoHeader() {
  return (
    <Group>
      <IconWrapper icon={IconFolderOpen} size={24} color="orange" />
      <Text fw="bold">
        <Trans>Local Directory or NAS</Trans>
      </Text>
    </Group>
  );
}

function FileSystemRepo({ form }: Props) {
  return (
    <Stack>
      <FileSystemRepoHeader />
      <TextInput
        label={t`Directory Path`}
        placeholder={t`Enter directory path where you want to store repository files`}
        withAsterisk
        {...form.getInputProps("providerConfig.path")}
      />
    </Stack>
  );
}

export default FileSystemRepo;
