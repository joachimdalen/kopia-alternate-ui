import { Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconFile } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm, WebDavRepoConfig } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<WebDavRepoConfig>>;
};

function WebDavRepo({ form }: Props) {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconFile} size={32} color="indigo" />
        <Text fw="bold">WebDAV Server</Text>
      </Group>

      <Stack>
        <TextInput
          label="WebDAV Server URL"
          placeholder="http[s]://server:port/path"
          withAsterisk
          {...form.getInputProps("providerConfig.url")}
        />
        <Group grow>
          <TextInput
            label="Username"
            placeholder="Enter username"
            {...form.getInputProps("providerConfig.username")}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password"
            {...form.getInputProps("providerConfig.password")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}

export default WebDavRepo;
