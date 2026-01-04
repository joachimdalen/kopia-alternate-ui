import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconBrandAzure } from "@tabler/icons-react";
import { ObjectSchema, object, string } from "yup";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<AzureBlobStorageRepoConfig>>;
};

export type AzureBlobStorageRepoConfig = {
  container: string;
  storageAccount: string;
  prefix?: string;
  storageKey?: string;
  storageDomain?: string;
  sasToken?: string;
};

export const azureBlobStorageRepoConfigDefault: AzureBlobStorageRepoConfig = {
  container: "",
  storageAccount: "",
  prefix: "",
  storageKey: "",
  storageDomain: "",
  sasToken: ""
};

export const azureBlobRepoConfigSchema = (): ObjectSchema<AzureBlobStorageRepoConfig> =>
  object({
    container: string().required().label(t`Container`),
    storageAccount: string().required().label(t`Storage Account`),
    storageKey: string().optional().label(t`Access Key`),
    storageDomain: string().optional().label(t`Azure Storage Domain`),
    sasToken: string().optional().label(t`SAS Token`),
    prefix: string().optional().label(t`Object Name Prefix`)
  });

export function AzureBlobStorageRepoHeader() {
  return (
    <Group>
      <IconWrapper icon={IconBrandAzure} size={32} color="blue" />
      <Text fw="bold">
        <Trans>Azure Blob Storage</Trans>
      </Text>
    </Group>
  );
}

function AzureBlobStorageRepo({ form }: Props) {
  return (
    <Stack>
      <AzureBlobStorageRepoHeader />
      <Stack>
        <Group grow>
          <TextInput
            label={t`Container`}
            placeholder={t`Enter container name`}
            withAsterisk
            {...form.getInputProps("providerConfig.container")}
          />
          <TextInput
            label={t`Storage Account`}
            placeholder={t`Enter storage account name`}
            withAsterisk
            {...form.getInputProps("providerConfig.storageAccount")}
          />
        </Group>

        <Group grow>
          <TextInput
            label={t`Object Name Prefix`}
            placeholder={t`Enter object name prefix (optional)`}
            {...form.getInputProps("providerConfig.prefix")}
          />
          <PasswordInput
            label={t`Access Key`}
            placeholder={t`Enter secret access key`}
            {...form.getInputProps("providerConfig.storageKey")}
          />
        </Group>
        <Group grow>
          <TextInput
            label={t`Azure Storage Domain`}
            placeholder="Enter storage domain or leave empty for default 'blob.core.windows.net'"
            {...form.getInputProps("providerConfig.storageDomain")}
          />
          <PasswordInput
            label={t`SAS Token`}
            placeholder={t`Enter secret SAS token`}
            {...form.getInputProps("providerConfig.sasToken")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}

export default AzureBlobStorageRepo;
