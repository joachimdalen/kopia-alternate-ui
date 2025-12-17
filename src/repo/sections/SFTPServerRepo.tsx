import {
  Checkbox,
  Group,
  NumberInput,
  PasswordInput,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconServer2 } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function SFTPServerRepo() {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconServer2} size={32} color="orange" />
        <Text fw="bold">SFTP Server</Text>
      </Group>

      <Stack>
        <Group grow>
          <TextInput
            label="Host"
            placeholder="SSH host name (e.g., example.com)"
            withAsterisk
          />
          <NumberInput
            label="Port"
            placeholder="Port number (e.g., 22)"
            withAsterisk
            hideControls
          />
        </Group>
        <Group grow>
          <TextInput label="User" placeholder="Username" withAsterisk />
          <PasswordInput label="Password" placeholder="Password" withAsterisk />
        </Group>
        <TextInput
          label="Path"
          placeholder="Enter remote path to repository, e.g., '/mnt/data/repository'"
          withAsterisk
        />

        <Group grow>
          <TextInput
            label="Path to key file"
            placeholder="Enter path to the key file"
          />
          <TextInput
            label="Path to known_hosts File"
            placeholder="Enter path to the known_hosts file"
          />
        </Group>
        <Group grow>
          <Textarea
            label="Key Data"
            placeholder="Paste contents of the key file"
            rows={5}
          />
          <Textarea
            label="Known Hosts Data"
            placeholder="Paste contents of the known_hosts file"
            rows={5}
          />
        </Group>
        <Checkbox
          label="Launch external password-less SSH command"
          description="By default Kopia connects to the server using internal SSH client which supports limited options. Alternatively it may launch external password-less SSH command, which supports additional options, but is generally less efficient than the built-in client."
        />
      </Stack>
    </Stack>
  );
}

export default SFTPServerRepo;
