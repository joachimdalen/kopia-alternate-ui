import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
  Group,
  PasswordInput,
  Select,
  Stack,
  TextInput
} from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import type { AlgorithmsList } from "../core/types";
import type { AllProviderConfigurations } from "./ConfigureRepoSection";
import type { RepoConfigurationForm } from "./types";

export type Props = {
  goBack: () => void;
  form: UseFormReturnType<RepoConfigurationForm<AllProviderConfigurations>>;
};

function CreateRepoSection({ form, goBack }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const [algorithms, setAlgorithms] = useState<AlgorithmsList>();
  const { reloadStatus } = useAppContext();
  const getAlgorithmsAction = useApiRequest({
    action: () => kopiaService.getAlgorithms(),
    onReturn(resp) {
      setAlgorithms(resp);
      form.setFieldValue("ecc", resp.defaultEcc);
      form.setFieldValue("encryption", resp.defaultEncryption);
      form.setFieldValue("splitter", resp.defaultSplitter);
      form.setFieldValue("hash", resp.defaultHash);
    }
  });
  const getCurrentUserAction = useApiRequest({
    action: () => kopiaService.getCurrentUser(),
    onReturn(resp) {
      form.setFieldValue("hostname", resp.hostname);
      form.setFieldValue("username", resp.username);
    }
  });
  const createRepoAction = useApiRequest({
    action: (data?: object) => kopiaService.createRepo(data!),
    onReturn() {
      reloadStatus();
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: need-to-fix-later
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

  function createRepository() {
    const request = {
      storage: {
        type: form.values.provider,
        config: form.values.providerConfig
      },
      password: form.values.password,
      options: {
        blockFormat: {
          version: parseInt(form.values.formatVersion!),
          hash: form.values.hash,
          encryption: form.values.encryption,
          ecc: form.values.ecc,
          eccOverheadPercent: parseInt(form.values.eccOverheadPercent!)
        },
        objectFormat: {
          splitter: form.values.splitter
        }
      },
      clientOptions: {
        description: form.values.description,
        username: form.values.username,
        readonly: form.values.readonly,
        hostname: form.values.hostname
      }
    };

    createRepoAction.execute(request);
  }

  return (
    <Stack>
      <ErrorAlert error={createRepoAction.error} />
      <Group grow>
        <PasswordInput
          label={t`Repository Password`}
          withAsterisk
          placeholder={t`Enter repository password`}
          description={t`Used to encrypt content of the repository`}
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label={t`Confirm Repository Password`}
          description={t`Confirm the repository password`}
          withAsterisk
          placeholder={t`Enter repository password again`}
          {...form.getInputProps("confirmedPassword")}
        />
      </Group>
      <Accordion variant="separated">
        <AccordionItem value="advanced">
          <AccordionControl>
            <Trans>Advanced Options</Trans>
          </AccordionControl>
          <AccordionPanel>
            <Stack>
              <Group grow>
                <Select
                  label={t`Encryption`}
                  data={encryptionOptions}
                  allowDeselect={false}
                  withCheckIcon={false}
                  {...form.getInputProps("encryption")}
                />
                <Select
                  label={t`Hash Algorithm`}
                  data={hashOptions}
                  allowDeselect={false}
                  withCheckIcon={false}
                  {...form.getInputProps("hash")}
                />
              </Group>
              <Group grow>
                <Select
                  label={t`Splitter`}
                  data={splitterOptions}
                  allowDeselect={false}
                  withCheckIcon={false}
                  {...form.getInputProps("splitter")}
                />
                <Select
                  label={t`Repository Format`}
                  data={[
                    { label: t`Latest format`, value: "2" },
                    {
                      label: t`Legacy format compatible with v0.8`,
                      value: "1"
                    }
                  ]}
                  allowDeselect={false}
                  withCheckIcon={false}
                  {...form.getInputProps("formatVersion")}
                />
              </Group>
              <Group grow>
                <Select
                  label={t`Error Correction Overhead`}
                  data={[
                    { label: t`Disabled`, value: "0" },
                    { label: "1%", value: "1" },
                    { label: "2%", value: "2" },
                    { label: "5%", value: "5" },
                    { label: "10%", value: "10" }
                  ]}
                  allowDeselect={false}
                  withCheckIcon={false}
                  {...form.getInputProps("eccOverheadPercent")}
                />
                <Select
                  label={t`Error Correction Algorithm`}
                  disabled={form.values.eccOverheadPercent === "0"}
                  data={eccOptions}
                  allowDeselect={false}
                  withCheckIcon={false}
                  {...form.getInputProps("ecc")}
                />
              </Group>
              <Group grow>
                <TextInput
                  label={t`Username`}
                  description={t`Override this when restoring a snapshot taken by another user`}
                  {...form.getInputProps("username")}
                />
                <TextInput
                  label="Hostname"
                  description={t`Override this when restoring a snapshot taken on another machine`}
                  {...form.getInputProps("hostname")}
                />
              </Group>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Group mt="sm" justify="space-between">
        <Button size="xs" onClick={goBack} disabled={createRepoAction.loading}>
          <Trans>Back</Trans>
        </Button>
        <Button size="xs" color="green" onClick={() => createRepository()} loading={createRepoAction.loading}>
          <Trans>Create repository</Trans>
        </Button>
      </Group>
    </Stack>
  );
}

export default CreateRepoSection;
