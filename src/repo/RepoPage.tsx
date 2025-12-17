import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Card,
  Container,
  Group,
  Paper,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useForm, type UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import IconWrapper from "../core/IconWrapper";
import { supportedProviders } from "./repoConstants";
import AmazonS3Repo from "./sections/AmazonS3Repo";
import AzureBlobStorageRepo from "./sections/AzureBlobStorageRepo";
import BackblazeB2Repo from "./sections/BackblazeB2Repo";
import FileSystemRepo from "./sections/FileSystemRepo";
import GoogleCloudStorageRepo from "./sections/GoogleCloudStorageRepo";
import KopiaRepoServerRepo from "./sections/KopiaRepoServerRepo";
import KopiaRepoTokenRepo from "./sections/KopiaRepoTokenRepo";
import RcloneRepo from "./sections/RcloneRepo";
import SFTPServerRepo from "./sections/SFTPServerRepo";
import WebDavRepo from "./sections/WebDavRepo";
import type {
  AmazonS3RepoConfig,
  AzureBlobStorageRepoConfig,
  BackblazeB2RepoConfig,
  FileSystemRepoConfig,
  GoogleCloudStorageRepoConfig,
  KopiaRepoServerRepoConfig,
  KopiaRepoTokenRepoConfig,
  RcloneRepoConfig,
  RepoConfigurationForm,
  SftpRepoConfig,
  WebDavRepoConfig,
} from "./types";

export type AllProviderConfigurations =
  | AmazonS3RepoConfig
  | FileSystemRepoConfig
  | object;

function RepoPage() {
  const [selected, setSelected] = useState<string>("");
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm<RepoConfigurationForm<AllProviderConfigurations>>({
    mode: "controlled",
    initialValues: {
      hostname: "",
      username: "",
      provider: "",
      providerConfig: {},
      password: "",
      confirmPassword: "",
      ecc: "",
      eccOverheadPercent: "",
      encryption: "",
      formatVersion: "",
      hash: "",
      splitter: "",
    },
  });

  const getProvider = () => {
    switch (form.values.provider) {
      case "filesystem":
        return (
          <FileSystemRepo
            form={
              form as UseFormReturnType<
                RepoConfigurationForm<FileSystemRepoConfig>
              >
            }
          />
        );
      case "gcs":
        return (
          <GoogleCloudStorageRepo
            form={
              form as UseFormReturnType<
                RepoConfigurationForm<GoogleCloudStorageRepoConfig>
              >
            }
          />
        );
      case "s3":
        return (
          <AmazonS3Repo
            form={
              form as UseFormReturnType<
                RepoConfigurationForm<AmazonS3RepoConfig>
              >
            }
          />
        );
      case "b2":
        return (
          <BackblazeB2Repo
            form={
              form as UseFormReturnType<
                RepoConfigurationForm<BackblazeB2RepoConfig>
              >
            }
          />
        );
      case "azureBlob":
        return (
          <AzureBlobStorageRepo
            form={
              form as UseFormReturnType<
                RepoConfigurationForm<AzureBlobStorageRepoConfig>
              >
            }
          />
        );
      case "sftp":
        return (
          <SFTPServerRepo
            form={
              form as UseFormReturnType<RepoConfigurationForm<SftpRepoConfig>>
            }
          />
        );
      case "rclone":
        return (
          <RcloneRepo
            form={
              form as UseFormReturnType<RepoConfigurationForm<RcloneRepoConfig>>
            }
          />
        );
      case "webdav":
        return (
          <WebDavRepo
            form={
              form as UseFormReturnType<RepoConfigurationForm<WebDavRepoConfig>>
            }
          />
        );
      case "_server":
        return (
          <KopiaRepoServerRepo
            form={
              form as UseFormReturnType<
                RepoConfigurationForm<KopiaRepoServerRepoConfig>
              >
            }
          />
        );
      case "_token":
        return (
          <KopiaRepoTokenRepo
            form={
              form as UseFormReturnType<
                RepoConfigurationForm<KopiaRepoTokenRepoConfig>
              >
            }
          />
        );
    }
  };

  return (
    <Container>
      <Paper withBorder p="md">
        <Stepper active={active} onStepClick={setActive} size="xs">
          <Stepper.Step
            label="Select Provider"
            description="Select the preferred storage type"
          >
            <SimpleGrid cols={2}>
              {supportedProviders.map((p) => {
                return (
                  <UnstyledButton
                    key={p.provider}
                    onClick={() => {
                      form.setFieldValue("provider", p.provider);
                      setActive(1);
                    }}
                  >
                    <Card withBorder>
                      <Group wrap="nowrap">
                        <IconWrapper icon={p.icon} size={36} color={p.color} />
                        <Text>{p.description}</Text>
                      </Group>
                    </Card>
                  </UnstyledButton>
                );
              })}
            </SimpleGrid>
          </Stepper.Step>
          <Stepper.Step
            label="Configure Provider"
            description="Configure the selected provider"
          >
            {getProvider()}
          </Stepper.Step>
          <Stepper.Step
            label="Configure repository"
            description="Configure the repository"
          >
            <Stack>
              <Group grow>
                <PasswordInput
                  label="Repository Password"
                  withAsterisk
                  placeholder="Enter repository password"
                  description="Used to encrypt content of the repository"
                  {...form.getInputProps("password")}
                />
                <PasswordInput
                  label="Confirm Repository Password"
                  description="Confirm the repository password"
                  withAsterisk
                  placeholder="Enter repository password again"
                  {...form.getInputProps("confirmedPassword")}
                />
              </Group>
              <Accordion variant="separated">
                <AccordionItem value="advanced">
                  <AccordionControl>Advanced Options</AccordionControl>
                  <AccordionPanel>
                    <Stack>
                      <Group grow>
                        <Select
                          label="Encryption"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
                          {...form.getInputProps("encryption")}
                        />
                        <Select
                          label="Hash Algorithm"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
                          {...form.getInputProps("hashAlgorithm")}
                        />
                      </Group>
                      <Group grow>
                        <Select
                          label="Splitter"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
                          {...form.getInputProps("splitter")}
                        />
                        <Select
                          label="Repository Format"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
                          {...form.getInputProps("repositoryFormat")}
                        />
                      </Group>
                      <Group grow>
                        <Select
                          label="Error Correction Overhead"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
                          {...form.getInputProps("errorCorrectionOverhead")}
                        />
                        <Select
                          label="Error Correction Algorithm"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
                          {...form.getInputProps("hashAlgorithm")}
                        />
                      </Group>
                      <Group grow>
                        <TextInput
                          label="Username"
                          description="Override this when restoring a snapshot taken by another user"
                        />
                        <TextInput
                          label="Hostname"
                          description="Override this when restoring a snapshot taken on another machine"
                        />
                      </Group>
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Stack>
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </Paper>
    </Container>
  );

  if (selected === "") {
    return (
      <Container>
        <Stack>
          <Stack gap={0}>
            <Title order={1}>Select Storage Type</Title>
            <Text>
              To connect to a repository or create one, select the preferred
              storage type:
            </Text>
          </Stack>
          <SimpleGrid cols={2}>
            {supportedProviders.map((p) => {
              return (
                <UnstyledButton
                  key={p.provider}
                  onClick={() => setSelected(p.provider)}
                >
                  <Card withBorder>
                    <Group wrap="nowrap">
                      <IconWrapper icon={p.icon} size={36} color={p.color} />
                      <Text>{p.description}</Text>
                    </Group>
                  </Card>
                </UnstyledButton>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Container>
    );
  }
}

export default RepoPage;
