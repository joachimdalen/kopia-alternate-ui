import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
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
        <Text fw="bold"><Trans>SFTP Server</Trans></Text>
      </Group>

      <Stack>
        <Group grow>
          <TextInput
            label={t`Host`}
            placeholder={t`SSH host name (e.g., example.com)`}
            withAsterisk
            {...form.getInputProps("providerConfig.host")}
          />
          <NumberInput
            label={t`Port`}
            placeholder={t`Port number (e.g., 22)`}
            withAsterisk
            hideControls
            {...form.getInputProps("providerConfig.port")}
          />
        </Group>
        <Group grow>
          <TextInput
            label={t`User`}
            placeholder={t`Username`}
            withAsterisk
            {...form.getInputProps("providerConfig.username")}
          />
          {!form.values.providerConfig.externalSSH && (
            <PasswordInput
              label={t`Password`}
              placeholder={t`Password`}
              {...form.getInputProps("providerConfig.password")}
            />
          )}
        </Group>
        <TextInput
          label={t`Path`}
          placeholder={t`Enter remote path to repository, e.g., '/mnt/data/repository'`}
          withAsterisk
          {...form.getInputProps("providerConfig.path")}
        />

        {!form.values.providerConfig.externalSSH && (
          <>
            <Group grow>
              <TextInput
                label={t`Path to key file`}
                placeholder={t`Enter path to the key file`}
                {...form.getInputProps("providerConfig.keyfile")}
              />
              <TextInput
                label={t`Path to known_hosts File`}
                placeholder={t`Enter path to the known_hosts file`}
                {...form.getInputProps("providerConfig.knownhostsFile")}
              />
            </Group>
            <Group grow>
              <Textarea
                label={t`Key Data`}
                placeholder={t`Paste contents of the key file`}
                rows={5}
                {...form.getInputProps("providerConfig.keyData")}
              />
              <Textarea
                label={t`Known Hosts Data`}
                placeholder={t`Paste contents of the known_hosts file`}
                rows={5}
                {...form.getInputProps("providerConfig.knownHostsData")}
              />
            </Group>
          </>
        )}
        <Checkbox
          label={t`Launch external password-less SSH command`}
          description={t`By default Kopia connects to the server using internal SSH client which supports limited options. Alternatively it may launch external password-less SSH command, which supports additional options, but is generally less efficient than the built-in client.`}
          {...form.getInputProps("providerConfig.externalSSH", {
            type: "checkbox",
          })}
        />
        {form.values.providerConfig.externalSSH && (
          <Group grow>
            <TextInput
              label={t`SSH Command`}
              placeholder={t`Enter passwordless SSH command to execute (typically 'ssh')`}
              {...form.getInputProps("providerConfig.sshCommand")}
            />
            <TextInput
              label={t`SSH Arguments`}
              placeholder={t`Enter SSH command arguments ('user@host -s sftp' will be appended automatically)`}
              {...form.getInputProps("providerConfig.sshArguments")}
            />
          </Group>
        )}
      </Stack>
    </Stack>
  );
}

export default SFTPServerRepo;
