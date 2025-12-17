import {
  Container,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { IconServer } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function KopiaRepoServerRepo() {
  return (
    <Container>
      <Stack>
        <Group>
          <IconWrapper icon={IconServer} size={32} color="lime" />
          <Title order={1}>Kopia Repository Server</Title>
        </Group>

        <Paper withBorder p="md">
          <Stack>
            <TextInput
              label="Server address"
              placeholder="Enter server URL (https://<host>:port)"
              withAsterisk
            />
            <TextInput
              label="Trusted server certificate fingerprint (SHA256)"
              placeholder="Enter trusted server certificate fingerprint printed at server startup"
            />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default KopiaRepoServerRepo;
