import {
  Container,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function RcloneRepo() {
  return (
    <Container>
      <Stack>
        <Group>
          <IconWrapper icon={IconRefresh} size={32} color="grape" />
          <Title order={1}>Rclone Remote</Title>
        </Group>

        <Paper withBorder p="md">
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
        </Paper>
      </Stack>
    </Container>
  );
}

export default RcloneRepo;
