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
        <Text fw="bold">Rclone Remote</Text>
      </Group>

      <Stack>
        <TextInput
          label="Rclone Remote Path"
          placeholder="Enter <name-of-rclone-remote>:<path>"
          withAsterisk
          {...form.getInputProps("providerConfig.remotePath")}
        />
        <TextInput
          label="Rclone Executable Path"
          placeholder="Enter path to rclone executable"
          {...form.getInputProps("providerConfig.rcloneExe")}
        />
      </Stack>
    </Stack>
  );
}

export default RcloneRepo;
