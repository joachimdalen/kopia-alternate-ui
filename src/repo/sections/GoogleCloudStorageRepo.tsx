import {
  Container,
  Group,
  JsonInput,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { IconBrandGoogleDrive } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function GoogleCloudStorageRepo() {
  return (
    <Container>
      <Stack>
        <Group>
          <IconWrapper icon={IconBrandGoogleDrive} size={32} color="yellow" />
          <Title order={1}>Google Cloud Storage</Title>
        </Group>

        <Paper withBorder p="md">
          <Stack>
            <Group grow>
              <TextInput
                label="GCS Bucket"
                placeholder="Enter bucket name"
                withAsterisk
              />
              <TextInput
                label="Object Name Prefix"
                placeholder="Enter object name prefix (optional)"
              />
            </Group>
            <TextInput
              label="Credentials File"
              placeholder="Enter name of credentials JSON file"
            />
            <JsonInput
              label="Credentials JSON"
              placeholder="Paste JSON credentials here"
              rows={5}
            />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default GoogleCloudStorageRepo;
