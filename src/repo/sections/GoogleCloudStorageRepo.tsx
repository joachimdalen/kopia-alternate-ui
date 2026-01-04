import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Group, JsonInput, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconBrandGoogleDrive } from "@tabler/icons-react";
import { ObjectSchema, object, string } from "yup";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<GoogleCloudStorageRepoConfig>>;
};

export type GoogleCloudStorageRepoConfig = {
  bucket: string;
  prefix?: string;
  credentialsFile?: string;
  credentials?: string;
};
export const googleCloudStorageRepoConfigDefault: GoogleCloudStorageRepoConfig = {
  bucket: "",
  prefix: "",
  credentialsFile: "",
  credentials: ""
};

export const googleCloudStorageRepoConfigSchema = (): ObjectSchema<GoogleCloudStorageRepoConfig> =>
  object({
    bucket: string().required().label(t`Bucket`),
    prefix: string().optional().label(t`Object Name Prefix`),
    credentialsFile: string().optional().label(t`Credentials File`),
    credentials: string().optional().label(t`Credentials JSON`)
  });

export function GoogleCloudStorageRepoHeader() {
  return (
    <Group>
      <IconWrapper icon={IconBrandGoogleDrive} size={24} color="yellow" />
      <Text fw="bold">
        <Trans>Google Cloud Storage</Trans>
      </Text>
    </Group>
  );
}

function GoogleCloudStorageRepo({ form }: Props) {
  return (
    <Stack>
      <GoogleCloudStorageRepoHeader />
      <Stack>
        <Group grow>
          <TextInput
            label={t`Bucket`}
            placeholder={t`Enter bucket name`}
            withAsterisk
            {...form.getInputProps("providerConfig.bucket")}
          />
          <TextInput
            label={t`Object Name Prefix`}
            placeholder={t`Enter object name prefix (optional)`}
            {...form.getInputProps("providerConfig.prefix")}
          />
        </Group>
        <TextInput
          label={t`Credentials File`}
          placeholder={t`Enter name of credentials JSON file`}
          {...form.getInputProps("providerConfig.credentialsFile")}
        />
        <JsonInput
          label={t`Credentials JSON`}
          placeholder={t`Paste JSON credentials here`}
          rows={5}
          {...form.getInputProps("providerConfig.credentials")}
        />
      </Stack>
    </Stack>
  );
}

export default GoogleCloudStorageRepo;
