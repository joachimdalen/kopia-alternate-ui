import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
import useApiRequest from "../core/hooks/useApiRequest";
import kopiaService from "../core/kopiaService";
import type { AlgorithmsList } from "../core/types";
import type { AllProviderConfigurations } from "./RepoPage";
import type { RepoConfigurationForm } from "./types";

export type Props = {
  form: UseFormReturnType<RepoConfigurationForm<AllProviderConfigurations>>;
};

function ConnectRepoSection({ form }: Props) {
  const [algorithms, setAlgorithms] = useState<AlgorithmsList>();

  const getAlgorithmsAction = useApiRequest({
    action: () => kopiaService.getAlgorithms(),
    onReturn(resp) {
      setAlgorithms(resp);
      form.setFieldValue("ecc", resp.defaultEcc);
      form.setFieldValue("encryption", resp.defaultEncryption);
      form.setFieldValue("splitter", resp.defaultSplitter);
      form.setFieldValue("hash", resp.defaultHash);
    },
  });
  const getCurrentUserAction = useApiRequest({
    action: () => kopiaService.getCurrentUser(),
    onReturn(resp) {
      form.setFieldValue("hostname", resp.hostname);
      form.setFieldValue("username", resp.username);
    },
  });
  useEffect(() => {
    getAlgorithmsAction.execute();
    getCurrentUserAction.execute();
  }, []);

  const encryptionOptions = useMemo(() => {
    if (algorithms == undefined) return [];
    return algorithms.encryption.map((ea) => ({ label: ea.id, value: ea.id }));
  }, [algorithms]);

  const hashOptions = useMemo(() => {
    if (algorithms === undefined) return [];
    return algorithms.hash.map((ea) => ({ label: ea.id, value: ea.id }));
  }, [algorithms]);

  const eccOptions = useMemo(() => {
    if (algorithms === undefined) return [];
    return algorithms.ecc.map((ea) => ({ label: ea.id, value: ea.id }));
  }, [algorithms]);

  const splitterOptions = useMemo(() => {
    if (algorithms === undefined) return [];
    return algorithms.splitter.map((ea) => ({ label: ea.id, value: ea.id }));
  }, [algorithms]);
  return (
    <Stack>
      <TextInput
        label="Connect as"
        defaultValue={`${form.values.username}@${form.values.password}`}
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
    </Stack>
  );
}

export default ConnectRepoSection;
