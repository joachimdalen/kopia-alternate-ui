import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Checkbox, Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconBrandAmazon } from "@tabler/icons-react";
import { boolean, ObjectSchema, object, string } from "yup";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<AmazonS3RepoConfig>>;
};
export type AmazonS3RepoConfig = {
  bucket: string;
  endpoint: string;
  doNotUseTLS: boolean;
  doNotVerifyTLS: boolean;
  accessKeyID: string;
  secretAccessKey: string;
  region?: string;
  sessionToken?: string;
  prefix?: string;
};

export const amazonS3RepoConfigDefault: AmazonS3RepoConfig = {
  bucket: "",
  endpoint: "",
  doNotUseTLS: false,
  doNotVerifyTLS: false,
  accessKeyID: "",
  secretAccessKey: "",
  region: "",
  sessionToken: "",
  prefix: ""
};

export const amazonS3RepoConfigSchema = (): ObjectSchema<AmazonS3RepoConfig> =>
  object({
    bucket: string().required().label(t`Bucket`),
    endpoint: string().required().label(t`Server Endpoint`),
    accessKeyID: string().required().label(t`Access Key ID`),
    secretAccessKey: string().required().label(t`Secret Access Key`),
    region: string().optional().label(t`Override Region`),
    doNotUseTLS: boolean().required().label(t`Use HTTP connection (insecure)`),
    doNotVerifyTLS: boolean().required().label(t`Do not verify TLS certificate`),
    sessionToken: string().optional().label(t`Enter session token (optional)`),
    prefix: string().optional().label(t`Object Name Prefix`)
  });

export function AmazonS3RepoHeader() {
  return (
    <Group>
      <IconWrapper icon={IconBrandAmazon} size={32} color="orange" />
      <Text fw="bold">
        <Trans>Amazon S3 or Compatible Storage</Trans>
      </Text>
    </Group>
  );
}

function AmazonS3Repo({ form }: Props) {
  return (
    <Stack>
      <AmazonS3RepoHeader />
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
              type: "checkbox"
            })}
          />
          <Checkbox
            label={t`Do not verify TLS certificate`}
            {...form.getInputProps("providerConfig.doNotVerifyTLS", {
              type: "checkbox"
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
