import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Group,
  Select,
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

function RepoAdvancedConfig({ form }: Props) {
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
    <Accordion variant="separated">
      <AccordionItem value="advanced">
        <AccordionControl>Advanced Options</AccordionControl>
        <AccordionPanel>
          <Stack>
            <Group grow>
              <Select
                label="Encryption"
                data={encryptionOptions}
                allowDeselect={false}
                withCheckIcon={false}
                {...form.getInputProps("encryption")}
              />
              <Select
                label="Hash Algorithm"
                data={hashOptions}
                allowDeselect={false}
                withCheckIcon={false}
                {...form.getInputProps("hash")}
              />
            </Group>
            <Group grow>
              <Select
                label="Splitter"
                data={splitterOptions}
                allowDeselect={false}
                withCheckIcon={false}
                {...form.getInputProps("splitter")}
              />
              <Select
                label="Repository Format"
                data={[
                  { label: "Latest format", value: "2" },
                  { label: "Legacy format compatible with v0.8", value: "1" },
                ]}
                allowDeselect={false}
                withCheckIcon={false}
                {...form.getInputProps("formatVersion")}
              />
            </Group>
            <Group grow>
              <Select
                label="Error Correction Overhead"
                data={[
                  { label: "Disabled", value: "0" },
                  { label: "1%", value: "1" },
                  { label: "2%", value: "2" },
                  { label: "5%", value: "5" },
                  { label: "10%", value: "10" },
                ]}
                allowDeselect={false}
                withCheckIcon={false}
                {...form.getInputProps("eccOverheadPercent")}
              />
              <Select
                label="Error Correction Algorithm"
                disabled={form.values.eccOverheadPercent === "0"}
                data={eccOptions}
                allowDeselect={false}
                withCheckIcon={false}
                {...form.getInputProps("ecc")}
              />
            </Group>
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
  );
}

export default RepoAdvancedConfig;
