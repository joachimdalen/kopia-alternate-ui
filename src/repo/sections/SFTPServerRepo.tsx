import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Checkbox, Group, NumberInput, PasswordInput, Stack, Text, Textarea, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconServer2 } from "@tabler/icons-react";
import { boolean, number, ObjectSchema, object, string, ValidationError } from "yup";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<SftpRepoConfig>>;
};

export type SftpRepoConfig = {
  host: string;
  username: string;
  port: number;
  path: string;

  password?: string;
  keyfile?: string;
  knownHostsFile?: string;
  keyData?: string;
  knownHostsData?: string;

  externalSSH: boolean;
  sshCommand?: string;
  sshArguments?: string;
};

export const sftRepoConfigDefault: SftpRepoConfig = {
  host: "",
  username: "",
  port: 22,
  path: "",
  externalSSH: false,
  password: "",
  keyfile: "",
  knownHostsFile: "",
  keyData: "",
  knownHostsData: "",
  sshArguments: "",
  sshCommand: ""
};

function isDefined(value?: string) {
  return value !== undefined && value !== null && value !== "";
}

export const sftpRepoConfigSchema = (): ObjectSchema<SftpRepoConfig> =>
  object({
    host: string().required().label(t`Host`),
    port: number().required().label(t`Port`),
    username: string().required().label(t`User`),
    path: string().required().label(t`Path`),

    password: string().optional().label(t`Password`),
    keyfile: string().optional().label(t`Path to key file`),
    keyData: string().optional().label(t`Key Data`),

    knownHostsFile: string().label(t`Path to known_hosts File`),
    knownHostsData: string().label(t`Known Hosts Data`),
    externalSSH: boolean().required().label(t`Launch external password-less SSH command`),
    sshCommand: string().optional().label(t`SSH Command`),
    sshArguments: string().optional().label(t`SSH Arguments`)
  }).when("providerConfig.externalSSH", {
    is: false,
    then: (schema) =>
      schema
        .test({
          name: "only-one-auth",
          test: (formValues, context) => {
            const { password, keyData, keyfile } = formValues;
            const presentFields = [isDefined(password), isDefined(keyData), isDefined(keyfile)];
            const result = presentFields.filter((x) => x == true).length > 1;
            if (result) {
              const errorMessage = t`Only one of Password, Path to key file or Key Data must be set`;
              const errors = [];

              if (presentFields[0]) {
                errors.push(
                  context.createError({
                    message: errorMessage,
                    path: "providerConfig.password"
                  })
                );
              }
              if (presentFields[1]) {
                errors.push(
                  context.createError({
                    message: errorMessage,
                    path: "providerConfig.keyData"
                  })
                );
              }
              if (presentFields[2]) {
                errors.push(
                  context.createError({
                    message: errorMessage,
                    path: "providerConfig.keyfile"
                  })
                );
              }
              throw new ValidationError(errors);
            }
            return true;
          }
        })
        .test({
          name: "only-one-known",
          test: (formValues, context) => {
            const { knownHostsFile, knownHostsData } = formValues;
            const presentFields = [isDefined(knownHostsFile), isDefined(knownHostsData)];
            const result = presentFields.filter((x) => x == true).length > 1;
            if (result) {
              const errorMessage = t`Only one of Path to known_hosts File or Known Hosts Data must be set`;
              const errors = [];
              if (presentFields[0]) {
                errors.push(
                  context.createError({
                    message: errorMessage,
                    path: "providerConfig.knownHostsFile"
                  })
                );
              }
              if (presentFields[1]) {
                errors.push(
                  context.createError({
                    message: errorMessage,
                    path: "providerConfig.knownHostsData"
                  })
                );
              }
              throw new ValidationError(errors);
            }
            return true;
          }
        })
  });

export function SFTPServerRepoHeader() {
  return (
    <Group>
      <IconWrapper icon={IconServer2} size={32} color="orange" />
      <Text fw="bold">
        <Trans>SFTP Server</Trans>
      </Text>
    </Group>
  );
}

function SFTPServerRepo({ form }: Props) {
  const pc = form.values.providerConfig as SftpRepoConfig;
  return (
    <Stack>
      <SFTPServerRepoHeader />
      <Stack>
        <Group grow align="flex-start">
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
        <Group grow align="flex-start">
          <TextInput
            label={t`User`}
            placeholder={t`Username`}
            withAsterisk
            {...form.getInputProps("providerConfig.username")}
          />
          {!pc.externalSSH && (
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

        {!pc.externalSSH && (
          <>
            <Group grow align="flex-start">
              <TextInput
                label={t`Path to key file`}
                placeholder={t`Enter path to the key file`}
                {...form.getInputProps("providerConfig.keyfile")}
              />
              <TextInput
                label={t`Path to known_hosts File`}
                placeholder={t`Enter path to the known_hosts file`}
                {...form.getInputProps("providerConfig.knownHostsFile")}
              />
            </Group>
            <Group grow align="flex-start">
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
            type: "checkbox"
          })}
        />
        {pc.externalSSH && (
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
