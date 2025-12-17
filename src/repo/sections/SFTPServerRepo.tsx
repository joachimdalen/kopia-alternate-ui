import {
  Checkbox,
  Group,
  NumberInput,
  PasswordInput,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconServer2 } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm, SftpRepoConfig } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<SftpRepoConfig>>;
};

function SFTPServerRepo({ form }: Props) {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconServer2} size={32} color="orange" />
        <Text fw="bold">SFTP Server</Text>
      </Group>

      <Stack>
        <Group grow>
          <TextInput
            label="Host"
            placeholder="SSH host name (e.g., example.com)"
            withAsterisk
            {...form.getInputProps("providerConfig.host")}
          />
          <NumberInput
            label="Port"
            placeholder="Port number (e.g., 22)"
            withAsterisk
            hideControls
            {...form.getInputProps("providerConfig.port")}
          />
        </Group>
        <Group grow>
          <TextInput
            label="User"
            placeholder="Username"
            withAsterisk
            {...form.getInputProps("providerConfig.username")}
          />
          {!form.values.providerConfig.externalSSH && (
            <PasswordInput
              label="Password"
              placeholder="Password"
              {...form.getInputProps("providerConfig.password")}
            />
          )}
        </Group>
        <TextInput
          label="Path"
          placeholder="Enter remote path to repository, e.g., '/mnt/data/repository'"
          withAsterisk
          {...form.getInputProps("providerConfig.path")}
        />

        {!form.values.providerConfig.externalSSH && (
          <>
            <Group grow>
              <TextInput
                label="Path to key file"
                placeholder="Enter path to the key file"
                {...form.getInputProps("providerConfig.keyfile")}
              />
              <TextInput
                label="Path to known_hosts File"
                placeholder="Enter path to the known_hosts file"
                {...form.getInputProps("providerConfig.knownhostsFile")}
              />
            </Group>
            <Group grow>
              <Textarea
                label="Key Data"
                placeholder="Paste contents of the key file"
                rows={5}
                {...form.getInputProps("providerConfig.keyData")}
              />
              <Textarea
                label="Known Hosts Data"
                placeholder="Paste contents of the known_hosts file"
                rows={5}
                {...form.getInputProps("providerConfig.knownHostsData")}
              />
            </Group>
          </>
        )}
        <Checkbox
          label="Launch external password-less SSH command"
          description="By default Kopia connects to the server using internal SSH client which supports limited options. Alternatively it may launch external password-less SSH command, which supports additional options, but is generally less efficient than the built-in client."
          {...form.getInputProps("providerConfig.externalSSH", {
            type: "checkbox",
          })}
        />
        {form.values.providerConfig.externalSSH && (
          <Group grow>
            <TextInput
              label="SSH Command"
              placeholder="Enter passwordless SSH command to execute (typically 'ssh'"
              {...form.getInputProps("providerConfig.sshCommand")}
            />
            <TextInput
              label="SSH Arguments"
              placeholder="Enter SSH command arguments ('user@host -s sftp' will be appended automatically)"
              {...form.getInputProps("providerConfig.sshArguments")}
            />
          </Group>
        )}
      </Stack>
    </Stack>
  );
}

export default SFTPServerRepo;
