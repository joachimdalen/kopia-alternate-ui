import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconFile } from "@tabler/icons-react";
import { ObjectSchema, object, string } from "yup";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<WebDavRepoConfig>>;
};

export type WebDavRepoConfig = {
  url: string;
  username?: string;
  password?: string;
};

export const webDavRepoConfigDefault: WebDavRepoConfig = {
  url: "",
  username: "",
  password: ""
};
export const webDavRepoConfigSchema = (): ObjectSchema<WebDavRepoConfig> =>
  object({
    url: string().url().required().label(t`WebDAV Server URL`),
    username: string().optional().label(t`Username`),
    password: string().optional().label(t`Password`)
  });

export function WebDavRepoHeader() {
  return (
    <Group>
      <IconWrapper icon={IconFile} size={32} color="indigo" />
      <Text fw="bold">
        <Trans>WebDAV Server</Trans>
      </Text>
    </Group>
  );
}

function WebDavRepo({ form }: Props) {
  return (
    <Stack>
      <WebDavRepoHeader />
      <Stack>
        <TextInput
          label={t`WebDAV Server URL`}
          placeholder="http[s]://server:port/path"
          withAsterisk
          {...form.getInputProps("providerConfig.url")}
        />
        <Group grow>
          <TextInput label={t`Username`} placeholder={t`Username`} {...form.getInputProps("providerConfig.username")} />
          <PasswordInput
            label={t`Password`}
            placeholder={t`Password`}
            {...form.getInputProps("providerConfig.password")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}

export default WebDavRepo;
