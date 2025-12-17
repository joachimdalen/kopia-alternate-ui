import { Group, Stack, Text, TextInput } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function RcloneRepo() {
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
        />
        <TextInput
          label="Rclone Executable Path"
          placeholder="Enter path to rclone executable"
        />
      </Stack>
    </Stack>
  );
}

export default RcloneRepo;
