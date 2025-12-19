import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import type { ConnectRepoRequest } from "../core/types";
import type { AllProviderConfigurations } from "./ConfigureRepoSection";
import type {
  KopiaRepoServerRepoConfig,
  KopiaRepoTokenRepoConfig,
  RepoConfigurationForm,
} from "./types";

export type Props = {
  goBack: () => void;
  form: UseFormReturnType<RepoConfigurationForm<AllProviderConfigurations>>;
};

function ConnectRepoSection({ form, goBack }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const { reloadStatus } = useAppContext();
  const getCurrentUserAction = useApiRequest({
    action: () => kopiaService.getCurrentUser(),
    onReturn(resp) {
      form.setFieldValue("hostname", resp.hostname);
      form.setFieldValue("username", resp.username);
    },
  });
  const connectRepoAction = useApiRequest({
    action: (data?: ConnectRepoRequest) => kopiaService.connectRepo(data!),
    onReturn() {
      reloadStatus();
    },
  });
  useEffect(() => {
    getCurrentUserAction.execute();
  }, []);

  if (getCurrentUserAction.loading) {
    return <LoadingOverlay visible />;
  }

  function connectToRepository() {
    let request: ConnectRepoRequest = {
      clientOptions: {
        description: form.values.description,
        username: form.values.username,
        readonly: form.values.readonly,
        hostname: form.values.hostname,
      },
    };
    switch (form.values.provider) {
      case "_token": {
        request = {
          ...request,
          token: (form.values.providerConfig as KopiaRepoTokenRepoConfig).token,
        };
        break;
      }
      case "_server": {
        request = {
          ...request,
          apiServer: form.values.providerConfig as KopiaRepoServerRepoConfig,
          password: form.values.password,
        };
        break;
      }
      default: {
        request = {
          ...request,
          storage: {
            type: form.values.provider,
            config: form.values.providerConfig,
          },
          password: form.values.password,
        };
        break;
      }
    }
    connectRepoAction.execute(request);
  }

  return (
    <Stack>
      <ErrorAlert error={connectRepoAction.error} />
      <TextInput
        label="Connect as"
        defaultValue={`${form.values.username}@${form.values.hostname}`}
      />
      {form.values.provider !== "_token" &&
        form.values.provider !== "_server" && (
          <PasswordInput
            label="Repository Password"
            withAsterisk
            placeholder="Enter repository password"
            description="Used to encrypt content of the repository"
            {...form.getInputProps("password")}
          />
        )}
      {form.values.provider === "_server" && (
        <PasswordInput
          label="Server Password"
          withAsterisk
          placeholder="Enter password to connect to server"
          {...form.getInputProps("password")}
        />
      )}
      <TextInput
        label="Repository Description"
        description="Helps to distinguish between multiple connected repositories"
        {...form.getInputProps("description")}
      />
      <Accordion variant="separated">
        <AccordionItem value="advanced">
          <AccordionControl>Advanced Options</AccordionControl>
          <AccordionPanel>
            <Stack>
              <Checkbox
                label="Connect in read-only mode"
                description="Read-only mode prevents any changes to the repository."
                {...form.getInputProps("readonly", { type: "checkbox" })}
              />
              <Group grow>
                <TextInput
                  label="Username"
                  description="Override this when restoring a snapshot taken by another user"
                  {...form.getInputProps("username")}
                />
                <TextInput
                  label="Hostname"
                  description="Override this when restoring a snapshot taken on another machine"
                  {...form.getInputProps("hostname")}
                />
              </Group>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Group mt="sm" justify="space-between">
        <Button size="xs" onClick={goBack} disabled={connectRepoAction.loading}>
          Back
        </Button>
        <Button
          size="xs"
          color="green"
          onClick={() => connectToRepository()}
          loading={connectRepoAction.loading}
        >
          Connect to repository
        </Button>
      </Group>
    </Stack>
  );
}

export default ConnectRepoSection;
