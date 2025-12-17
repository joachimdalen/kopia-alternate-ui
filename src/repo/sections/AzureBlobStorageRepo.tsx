import { Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { IconBrandAzure } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function AzureBlobStorageRepo() {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconBrandAzure} size={32} color="blue" />
        <Text fw="bold">Azure Blob Storage</Text>
      </Group>

      <Stack>
        <Group grow>
          <TextInput
            label="Container"
            placeholder="Enter container name"
            withAsterisk
          />
          <TextInput
            label="Storage Account"
            placeholder="Enter storage account name"
            withAsterisk
          />
        </Group>

        <Group grow>
          <TextInput
            label="Object Name Prefix"
            placeholder="Enter object name prefix (optional)"
          />
          <PasswordInput
            label="Access Key"
            placeholder="Enter secret access key"
          />
        </Group>
        <Group grow>
          <TextInput
            label="Azure Storage Domain"
            placeholder="Enter storage domain or leave empty for default 'blob.core.windows.net'"
            withAsterisk
          />
          <PasswordInput
            label="SAS Token"
            placeholder="Enter secret SAS token"
            withAsterisk
          />
        </Group>
      </Stack>
    </Stack>
  );
}

export default AzureBlobStorageRepo;
