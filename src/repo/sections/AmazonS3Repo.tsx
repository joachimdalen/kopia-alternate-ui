import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Checkbox,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconBrandAmazon } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type { AmazonS3RepoConfig, RepoConfigurationForm } from "../types";
type Props = {
  form: UseFormReturnType<RepoConfigurationForm<AmazonS3RepoConfig>>;
};

function AmazonS3Repo({ form }: Props) {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconBrandAmazon} size={32} color="orange" />
        <Text fw="bold"><Trans>Amazon S3 or Compatible Storage</Trans></Text>
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
            label={t`Server Endpoint`}
            placeholder={t`Enter server address (e.g., s3.amazonaws.com)`}
            withAsterisk
            {...form.getInputProps("providerConfig.endpoint")}
          />
        </Group>
        <Group>
          <Checkbox
            label={t`Use HTTP connection (insecure)`}
            {...form.getInputProps("providerConfig.doNotUseTLS", {
              type: "checkbox",
            })}
          />
          <Checkbox
            label={t`Do not verify TLS certificate`}
            {...form.getInputProps("providerConfig.doNotVerifyTLS", {
              type: "checkbox",
            })}
          />
        </Group>
        <Group grow>
          <TextInput
            label={t`Override Region`}
            placeholder={t`Enter specific region (e.g., us-west-1) or leave empty`}
            {...form.getInputProps("providerConfig.region")}
          />
          <TextInput
            label={t`Object Name Prefix`}
            placeholder={t`Enter object name prefix (optional)`}
            {...form.getInputProps("providerConfig.prefix")}
          />
        </Group>
        <Group grow>
          <TextInput
            label={t`Access Key ID`}
            placeholder={t`Enter access key ID`}
            withAsterisk
            {...form.getInputProps("providerConfig.accessKeyID")}
          />
          <PasswordInput
            label={t`Secret Access Key`}
            placeholder={t`Enter secret access key`}
            withAsterisk
            {...form.getInputProps("providerConfig.secretAccessKey")}
          />
        </Group>
        <PasswordInput
          label={t`Session token`}
          placeholder={t`Enter session token (optional)`}
          {...form.getInputProps("providerConfig.sessionToken")}
        />
      </Stack>
    </Stack>
  );
}

export default AmazonS3Repo;
