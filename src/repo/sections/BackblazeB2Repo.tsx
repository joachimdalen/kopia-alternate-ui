import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";
import { ObjectSchema, object, string } from "yup";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<BackblazeB2RepoConfig>>;
};

export type BackblazeB2RepoConfig = {
  bucket: string;
  keyId: string;
  key: string;
  prefix?: string;
};

export const backblazeB2RepoConfigDefault: BackblazeB2RepoConfig = {
  bucket: "",
  keyId: "",
  key: "",
  prefix: ""
};

export const backblazeRepoConfigSchema = (): ObjectSchema<BackblazeB2RepoConfig> =>
  object({
    bucket: string().required().label(t`Bucket`),
    keyId: string().required().label(t`Key ID`),
    key: string().required().label(t`Key`),
    prefix: string().optional().label(t`Object Name Prefix`)
  });

export function BackblazeB2RepoHeader() {
  return (
    <Group>
      <IconWrapper icon={IconInfoCircle} size={32} color="red" />
      <Text fw="bold">
        <Trans>Backblaze B2</Trans>
      </Text>
    </Group>
  );
}

function BackblazeB2Repo({ form }: Props) {
  return (
    <Stack>
      <BackblazeB2RepoHeader />
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
        <Group grow>
          <TextInput
            label={t`Key ID`}
            placeholder={t`Enter application or account key ID`}
            withAsterisk
            {...form.getInputProps("providerConfig.keyId")}
          />
          <PasswordInput
            label={t`Key`}
            placeholder={t`Enter application or account key`}
            withAsterisk
            {...form.getInputProps("providerConfig.key")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}

export default BackblazeB2Repo;
