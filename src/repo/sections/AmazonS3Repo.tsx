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
        <Text fw="bold">Amazon S3 or Compatible Storage</Text>
      </Group>

      <Stack>
        <Group grow>
          <TextInput
            label="Bucket"
            placeholder="Enter bucket name"
            withAsterisk
            {...form.getInputProps("providerConfig.bucket")}
          />
          <TextInput
            label="Server Endpoint"
            placeholder="Enter server address (e.g., s3.amazonaws.com)"
            withAsterisk
            {...form.getInputProps("providerConfig.endpoint")}
          />
        </Group>
        <Group>
          <Checkbox
            label="Use HTTP connection (insecure)"
            {...form.getInputProps("providerConfig.doNotUseTLS", {
              type: "checkbox",
            })}
          />
          <Checkbox
            label="Do not verify TLS certificate"
            {...form.getInputProps("providerConfig.doNotVerifyTLS", {
              type: "checkbox",
            })}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Override Region"
            placeholder="Enter specific region (e.g., us-west-1) or leave empty"
            {...form.getInputProps("providerConfig.region")}
          />
          <TextInput
            label="Object Name Prefix"
            placeholder="Enter object name prefix (optional)"
            {...form.getInputProps("providerConfig.prefix")}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Access Key ID"
            placeholder="Enter access key ID"
            withAsterisk
            {...form.getInputProps("providerConfig.accessKeyID")}
          />
          <PasswordInput
            label="Secret Access Key"
            placeholder="Enter secret access key"
            withAsterisk
            {...form.getInputProps("providerConfig.secretAccessKey")}
          />
        </Group>
        <PasswordInput
          label="Session token"
          placeholder="Enter session token (optional)"
          {...form.getInputProps("providerConfig.sessionToken")}
        />
      </Stack>
    </Stack>
  );
}

export default AmazonS3Repo;
