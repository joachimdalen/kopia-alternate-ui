import { Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { IconFile } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function WebDavRepo() {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconFile} size={32} color="indigo" />
        <Text fw="bold">WebDAV Server</Text>
      </Group>

      <Stack>
        <TextInput
          label="WebDAV Server URL"
          placeholder="http[s]://server:port/path"
          withAsterisk
        />
        <Group grow>
          <TextInput label="Username" placeholder="Enter username" />
          <PasswordInput label="Password" placeholder="Enter password" />
        </Group>
      </Stack>
    </Stack>
  );
}

export default WebDavRepo;
