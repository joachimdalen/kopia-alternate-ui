import {
  Checkbox,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconBrandAmazon } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

export type AmazonS3RepoConfig = {
  bucket: string;
  endpoint: string;
};

function AmazonS3Repo() {
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
          />
          <TextInput
            label="Server Endpoint"
            placeholder="Enter server address (e.g., s3.amazonaws.com)"
            withAsterisk
          />
        </Group>
        <Group>
          <Checkbox label="Use HTTP connection (insecure)" />
          <Checkbox label="Do not verify TLS certificate" />
        </Group>
        <Group grow>
          <TextInput
            label="Override Region"
            placeholder="Enter specific region (e.g., us-west-1) or leave empty"
          />
          <TextInput
            label="Object Name Prefix"
            placeholder="Enter object name prefix (optional)"
          />
        </Group>
        <Group grow>
          <TextInput
            label="Access Key ID"
            placeholder="Enter access key ID"
            withAsterisk
          />
          <PasswordInput
            label="Secret Access Key"
            placeholder="Enter secret access key"
            withAsterisk
          />
        </Group>
        <PasswordInput
          label="Session token"
          placeholder="Enter session token (optional)"
        />
      </Stack>
    </Stack>
  );
}

export default AmazonS3Repo;
