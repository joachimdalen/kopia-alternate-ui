import {
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function BackblazeB2Repo() {
  return (
    <Container>
      <Stack>
        <Group>
          <IconWrapper icon={IconInfoCircle} size={32} color="red" />
          <Title order={1}>Backblaze B2</Title>
        </Group>

        <Paper withBorder p="md">
          <Stack>
            <Group grow>
              <TextInput
                label="Bucket"
                placeholder="Enter bucket name"
                withAsterisk
              />
              <TextInput
                label="Object Name Prefix"
                placeholder="Enter object name prefix (optional)"
              />
            </Group>
            <Group grow>
              <TextInput
                label="Key ID"
                placeholder="Enter application or account key ID"
                withAsterisk
              />
              <PasswordInput
                label="Key"
                placeholder="Enter application or account key"
                withAsterisk
              />
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default BackblazeB2Repo;
