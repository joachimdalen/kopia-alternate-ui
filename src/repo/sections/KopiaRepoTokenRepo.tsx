import {
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Title,
} from "@mantine/core";
import { IconAsterisk } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function KopiaRepoTokenRepo() {
  return (
    <Container>
      <Stack>
        <Group>
          <IconWrapper icon={IconAsterisk} size={32} color="violet" />
          <Title order={1}>Use Repository Token</Title>
        </Group>

        <Paper withBorder p="md">
          <PasswordInput label="Token" placeholder="Paste connection token" />
        </Paper>
      </Stack>
    </Container>
  );
}

export default KopiaRepoTokenRepo;
