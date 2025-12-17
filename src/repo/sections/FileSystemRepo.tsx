import {
  Container,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { IconFolderOpen } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function FileSystemRepo() {
  return (
    <Container>
      <Stack>
        <Group>
          <IconWrapper icon={IconFolderOpen} size={32} color="orange" />
          <Title order={1}>Local Directory or NAS</Title>
        </Group>

        <Paper withBorder p="md">
          <TextInput
            label="Directory Path"
            placeholder="Enter directory path where you want to store repository files"
            withAsterisk
          />
        </Paper>
      </Stack>
    </Container>
  );
}

export default FileSystemRepo;
