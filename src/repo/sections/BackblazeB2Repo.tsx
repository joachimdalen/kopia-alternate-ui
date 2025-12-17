import { Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type { BackblazeB2RepoConfig, RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<BackblazeB2RepoConfig>>;
};

function BackblazeB2Repo({ form }: Props) {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconInfoCircle} size={32} color="red" />
        <Text fw="bold">Backblaze B2</Text>
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
            label="Object Name Prefix"
            placeholder="Enter object name prefix (optional)"
            {...form.getInputProps("providerConfig.prefix")}
          />
        </Group>
        <Group grow>
          <TextInput
            label="Key ID"
            placeholder="Enter application or account key ID"
            withAsterisk
            {...form.getInputProps("providerConfig.keyId")}
          />
          <PasswordInput
            label="Key"
            placeholder="Enter application or account key"
            withAsterisk
            {...form.getInputProps("providerConfig.key")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}

export default BackblazeB2Repo;
