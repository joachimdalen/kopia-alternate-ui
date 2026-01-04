import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Group, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconRefresh } from "@tabler/icons-react";
import { ObjectSchema, object, string } from "yup";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<RcloneRepoConfig>>;
};

export type RcloneRepoConfig = {
  remotePath: string;
  rcloneExe?: string;
};

export const rcloneRepoConfigDefault: RcloneRepoConfig = {
  remotePath: "",
  rcloneExe: ""
};

export const rcloneRepoConfigSchema = (): ObjectSchema<RcloneRepoConfig> =>
  object({
    remotePath: string().required().label(t`Rclone Remote Path`),
    rcloneExe: string().optional().label(t`Rclone Executable Path`)
  });

export function RcloneRepoHeader() {
  return (
    <Group>
      <IconWrapper icon={IconRefresh} size={32} color="grape" />
      <Text fw="bold">
        <Trans>Rclone Remote</Trans>
      </Text>
    </Group>
  );
}

function RcloneRepo({ form }: Props) {
  return (
    <Stack>
      <RcloneRepoHeader />
      <Stack>
        <TextInput
          label={t`Rclone Remote Path`}
          placeholder={t`Enter <name-of-rclone-remote>:<path>`}
          withAsterisk
          {...form.getInputProps("providerConfig.remotePath")}
        />
        <TextInput
          label={t`Rclone Executable Path`}
          placeholder={t`Enter path to rclone executable`}
          {...form.getInputProps("providerConfig.rcloneExe")}
        />
      </Stack>
    </Stack>
  );
}

export default RcloneRepo;
