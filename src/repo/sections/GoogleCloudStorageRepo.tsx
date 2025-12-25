import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Group, JsonInput, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconBrandGoogleDrive } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type { GoogleCloudStorageRepoConfig, RepoConfigurationForm } from "../types";
type Props = {
  form: UseFormReturnType<RepoConfigurationForm<GoogleCloudStorageRepoConfig>>;
};

function GoogleCloudStorageRepo({ form }: Props) {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconBrandGoogleDrive} size={24} color="yellow" />
        <Text fw="bold">
          <Trans>Google Cloud Storage</Trans>
        </Text>
      </Group>

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
