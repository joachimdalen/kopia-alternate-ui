import {
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { IconFile } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function WebDavRepo() {
  return (
    <Container>
      <Stack>
        <Group>
          <IconWrapper icon={IconFile} size={32} color="indigo" />
          <Title order={1}>WebDAV Server</Title>
        </Group>

        <Paper withBorder p="md">
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
        </Paper>
      </Stack>
    </Container>
  );
}

export default WebDavRepo;
