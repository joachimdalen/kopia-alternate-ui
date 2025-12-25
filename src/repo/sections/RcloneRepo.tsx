import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Group, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconRefresh } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type { RcloneRepoConfig, RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<RcloneRepoConfig>>;
};
function RcloneRepo({ form }: Props) {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconRefresh} size={32} color="grape" />
        <Text fw="bold">
          <Trans>Rclone Remote</Trans>
        </Text>
      </Group>

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
