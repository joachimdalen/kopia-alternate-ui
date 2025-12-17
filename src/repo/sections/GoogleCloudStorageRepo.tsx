import { Group, JsonInput, Stack, Text, TextInput } from "@mantine/core";
import { IconBrandGoogleDrive } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function GoogleCloudStorageRepo() {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconBrandGoogleDrive} size={24} color="yellow" />
        <Text fw="bold">Google Cloud Storage</Text>
      </Group>

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
    </Stack>
  );
}

export default GoogleCloudStorageRepo;
