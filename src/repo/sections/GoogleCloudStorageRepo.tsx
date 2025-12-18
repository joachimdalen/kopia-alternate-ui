import { Group, JsonInput, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconBrandGoogleDrive } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type {
  GoogleCloudStorageRepoConfig,
  RepoConfigurationForm,
} from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<GoogleCloudStorageRepoConfig>>;
};

function GoogleCloudStorageRepo({ form }: Props) {
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
            {...form.getInputProps("providerConfig.bucket")}
          />
          <TextInput
            label="Object Name Prefix"
            placeholder="Enter object name prefix (optional)"
            {...form.getInputProps("providerConfig.prefix")}
          />
        </Group>
        <TextInput
          label="Credentials File"
          placeholder="Enter name of credentials JSON file"
          {...form.getInputProps("providerConfig.credentialsFile")}
        />
        <JsonInput
          label="Credentials JSON"
          placeholder="Paste JSON credentials here"
          rows={5}
          {...form.getInputProps("providerConfig.credentials")}
        />
      </Stack>
    </Stack>
  );
}

export default GoogleCloudStorageRepo;
