import { Group, Stack, Text, TextInput } from "@mantine/core";
import { IconFolderOpen } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function FileSystemRepo() {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconFolderOpen} size={24} color="orange" />
        <Text fw="bold">Local Directory or NAS</Text>
      </Group>
      <TextInput
        label="Directory Path"
        placeholder="Enter directory path where you want to store repository files"
        withAsterisk
      />
    </Stack>
  );
}

export default FileSystemRepo;
