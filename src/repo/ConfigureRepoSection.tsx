import {
  Button,
  Card,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stepper,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useForm, type UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import type { CheckRepoRequest } from "../core/types";
import ConnectRepoSection from "./ConnectRepoSection";
import CreateRepoSection from "./CreateRepoSection";
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
  | AzureBlobStorageRepoConfig
  | BackblazeB2RepoConfig
  | GoogleCloudStorageRepoConfig
  | KopiaRepoServerRepoConfig
  | KopiaRepoTokenRepoConfig
  | RcloneRepoConfig
  | SftpRepoConfig
  | WebDavRepoConfig
  | object;

function ConfigureRepoSection() {
  const { kopiaService } = useServerInstanceContext();
  const [active, setActive] = useState(0);
  const [confirmCreate, setConfirmCreate] = useState(false);

  const checkRepoAction = useApiRequest({
    action: (data?: CheckRepoRequest) => kopiaService.repoExists(data!),
    onReturn() {
      setConfirmCreate(false);
      setActive(2);
    },
    handleError(data) {
      if (data.title === "NOT_INITIALIZED") {
        console.log("NOT_INITIALIZED");
        setConfirmCreate(true);
        setActive(2);
        return false;
      }
      return true;
    },
  });

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
      eccOverheadPercent: "0",
      encryption: "",
      formatVersion: "2",
      hash: "",
      splitter: "",
      readonly: false,
      description: "My Repository",
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

  const validateConfig = () => {
    if (
      form.values.provider === "_token" ||
      form.values.provider === "_server"
    ) {
      setConfirmCreate(false);
      setActive(2);
      return;
    }

    const request = {
      storage: {
        type: form.values.provider,
        config: form.values.providerConfig,
      },
    };
    checkRepoAction.execute(request);
  };

  return (
    <Container>
      <Paper withBorder p="md" pos="relative">
        <ErrorAlert error={checkRepoAction.error} />
        <Stepper active={active} size="xs">
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
                      form.setFieldValue("providerConfig", {});
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
            <Group mt="sm" justify="space-between">
              <Button
                onClick={() => {
                  form.setFieldValue("provider", "");
                  setActive(0);
                }}
                size="xs"
              >
                Back
              </Button>
              <Button
                size="xs"
                onClick={validateConfig}
                disabled={!form.isValid("providerConfig")}
              >
                Next
              </Button>
            </Group>
          </Stepper.Step>
          <Stepper.Step
            label={confirmCreate ? "Create repository" : "Configure repository"}
            description={
              confirmCreate
                ? "Create a new repository"
                : "Configure the repository"
            }
          >
            {confirmCreate && (
              <CreateRepoSection
                form={form}
                goBack={() => {
                  setActive(1);
                }}
              />
            )}
            {!confirmCreate && (
              <ConnectRepoSection
                form={form}
                goBack={() => {
                  setActive(1);
                }}
              />
            )}
          </Stepper.Step>
        </Stepper>
      </Paper>
    </Container>
  );
}

export default ConfigureRepoSection;
