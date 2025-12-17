import { Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconBrandAzure } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type {
  AzureBlobStorageRepoConfig,
  RepoConfigurationForm,
} from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<AzureBlobStorageRepoConfig>>;
};

function AzureBlobStorageRepo({ form }: Props) {
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
            {...form.getInputProps("providerConfig.container")}
          />
          <TextInput
            label="Storage Account"
            placeholder="Enter storage account name"
            withAsterisk
            {...form.getInputProps("providerConfig.storageAccount")}
          />
        </Group>

        <Group grow>
          <TextInput
            label="Object Name Prefix"
            placeholder="Enter object name prefix (optional)"
            {...form.getInputProps("providerConfig.prefix")}
          />
          <PasswordInput
            label="Access Key"
            placeholder="Enter secret access key"
            {...form.getInputProps("providerConfig.storageKey")}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Azure Storage Domain"
            placeholder="Enter storage domain or leave empty for default 'blob.core.windows.net'"
            {...form.getInputProps("providerConfig.storageDomain")}
          />
          <PasswordInput
            label="SAS Token"
            placeholder="Enter secret SAS token"
            {...form.getInputProps("providerConfig.sasToken")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}

export default AzureBlobStorageRepo;
