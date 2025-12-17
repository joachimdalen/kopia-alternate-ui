import {
  Checkbox,
  Container,
  Group,
  NumberInput,
  Paper,
  PasswordInput,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconServer2 } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function SFTPServerRepo() {
  return (
    <Container>
      <Stack>
        <Group>
          <IconWrapper icon={IconServer2} size={32} color="orange" />
          <Title order={1}>SFTP Server</Title>
        </Group>

        <Paper withBorder p="md">
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
              <PasswordInput
                label="Password"
                placeholder="Password"
                withAsterisk
              />
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
        </Paper>
      </Stack>
    </Container>
  );
}

export default SFTPServerRepo;
