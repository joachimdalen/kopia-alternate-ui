import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, Card, Container, Group, Paper, SimpleGrid, Stepper, Text, UnstyledButton } from "@mantine/core";
import { type UseFormReturnType, useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { useState } from "react";
import { boolean, ObjectSchema, object, string } from "yup";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import type { CheckRepoRequest } from "../core/types";
import ConnectRepoSection from "./ConnectRepoSection";
import CreateRepoSection from "./CreateRepoSection";
import { supportedProviders } from "./repoConstants";
import AmazonS3Repo, {
  type AmazonS3RepoConfig,
  amazonS3RepoConfigDefault,
  amazonS3RepoConfigSchema
} from "./sections/AmazonS3Repo";
import AzureBlobStorageRepo, {
  type AzureBlobStorageRepoConfig,
  azureBlobRepoConfigSchema,
  azureBlobStorageRepoConfigDefault
} from "./sections/AzureBlobStorageRepo";
import BackblazeB2Repo, {
  type BackblazeB2RepoConfig,
  backblazeB2RepoConfigDefault,
  backblazeRepoConfigSchema
} from "./sections/BackblazeB2Repo";
import FileSystemRepo, {
  type FileSystemRepoConfig,
  fileSystemRepoConfigDefault,
  fileSystemRepoConfigSchema
} from "./sections/FileSystemRepo";
import GoogleCloudStorageRepo, {
  type GoogleCloudStorageRepoConfig,
  googleCloudStorageRepoConfigDefault,
  googleCloudStorageRepoConfigSchema
} from "./sections/GoogleCloudStorageRepo";
import KopiaRepoServerRepo, {
  type KopiaRepoServerRepoConfig,
  kopiaRepoServerRepoConfigDefault,
  kopiaRepoServerRepoConfigSchema
} from "./sections/KopiaRepoServerRepo";
import KopiaRepoTokenRepo, {
  type KopiaRepoTokenRepoConfig,
  kopiaRepoTokenRepoConfigDefault,
  kopiaRepoTokenRepoConfigSchema
} from "./sections/KopiaRepoTokenRepo";
import RcloneRepo, {
  type RcloneRepoConfig,
  rcloneRepoConfigDefault,
  rcloneRepoConfigSchema
} from "./sections/RcloneRepo";
import SFTPServerRepo, {
  type SftpRepoConfig,
  sftpRepoConfigSchema,
  sftRepoConfigDefault
} from "./sections/SFTPServerRepo";
import WebDavRepo, {
  type WebDavRepoConfig,
  webDavRepoConfigDefault,
  webDavRepoConfigSchema
} from "./sections/WebDavRepo";
import type { RepoConfigurationForm } from "./types";

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
  | WebDavRepoConfig;

function ConfigureRepoSection() {
  const { kopiaService } = useServerInstanceContext();
  const [active, setActive] = useState(0);

  const getSchema = (): ObjectSchema<RepoConfigurationForm<object>> =>
    object({
      hostname: string(),
      username: string(),
      provider: string()
        .required()
        .oneOf(["filesystem", "gcs", "s3", "b2", "azureBlob", "sftp", "rclone", "webdav", "_server", "_token"]),
      providerConfig: object().when("provider", ([provider]) => {
        switch (provider) {
          case "filesystem":
            return fileSystemRepoConfigSchema();
          case "gcs":
            return googleCloudStorageRepoConfigSchema();
          case "s3":
            return amazonS3RepoConfigSchema();
          case "b2":
            return backblazeRepoConfigSchema();
          case "azureBlob":
            return azureBlobRepoConfigSchema();
          case "sftp":
            return sftpRepoConfigSchema();
          case "rclone":
            return rcloneRepoConfigSchema();
          case "webdav":
            return webDavRepoConfigSchema();
          case "_server":
            return kopiaRepoServerRepoConfigSchema();
          case "_token":
            return kopiaRepoTokenRepoConfigSchema();
        }
        throw Error("Unknown provider");
      }),
      password: string().when("provider", {
        is: (p: string) => p !== "_server",
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.optional()
      }),
      confirmPassword: string().when("confirmCreate", {
        is: true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.optional()
      }),
      ecc: string(),
      eccOverheadPercent: string(),
      encryption: string(),
      formatVersion: string(),
      hash: string(),
      splitter: string(),
      readonly: boolean(),
      description: string(),
      confirmCreate: boolean()
    }).when("confirmCreate", {
      is: true,
      then: (schema) =>
        schema.test({
          name: "password-confirmation",
          test: (values, context) => {
            if (values.password !== values.confirmPassword) {
              return context.createError({
                path: "confirmPassword",
                message: "Passwords does not match"
              });
            }
          }
        })
    });
  const form = useForm<RepoConfigurationForm<AllProviderConfigurations>>({
    mode: "controlled",
    initialValues: {
      hostname: "",
      username: "",
      provider: "",
      // biome-ignore lint/suspicious/noExplicitAny: no initial type
      providerConfig: {} as any,
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
      confirmCreate: false
    },
    validate: yupResolver(getSchema()),
    validateInputOnBlur: true
  });
  const checkRepoAction = useApiRequest({
    action: (data?: CheckRepoRequest) => kopiaService.repoExists(data!),
    onReturn() {
      form.setFieldValue("confirmCreate", true);
      setActive(2);
    },
    handleError(data) {
      if (data.title === "NOT_INITIALIZED") {
        console.log("NOT_INITIALIZED");
        form.setFieldValue("confirmCreate", true);
        setActive(2);
        return false;
      }
      return true;
    }
  });

  const getProvider = () => {
    switch (form.values.provider) {
      case "filesystem":
        return <FileSystemRepo form={form as UseFormReturnType<RepoConfigurationForm<FileSystemRepoConfig>>} />;
      case "gcs":
        return (
          <GoogleCloudStorageRepo
            form={form as UseFormReturnType<RepoConfigurationForm<GoogleCloudStorageRepoConfig>>}
          />
        );
      case "s3":
        return <AmazonS3Repo form={form as UseFormReturnType<RepoConfigurationForm<AmazonS3RepoConfig>>} />;
      case "b2":
        return <BackblazeB2Repo form={form as UseFormReturnType<RepoConfigurationForm<BackblazeB2RepoConfig>>} />;
      case "azureBlob":
        return (
          <AzureBlobStorageRepo form={form as UseFormReturnType<RepoConfigurationForm<AzureBlobStorageRepoConfig>>} />
        );
      case "sftp":
        return <SFTPServerRepo form={form as UseFormReturnType<RepoConfigurationForm<SftpRepoConfig>>} />;
      case "rclone":
        return <RcloneRepo form={form as UseFormReturnType<RepoConfigurationForm<RcloneRepoConfig>>} />;
      case "webdav":
        return <WebDavRepo form={form as UseFormReturnType<RepoConfigurationForm<WebDavRepoConfig>>} />;
      case "_server":
        return (
          <KopiaRepoServerRepo form={form as UseFormReturnType<RepoConfigurationForm<KopiaRepoServerRepoConfig>>} />
        );
      case "_token":
        return <KopiaRepoTokenRepo form={form as UseFormReturnType<RepoConfigurationForm<KopiaRepoTokenRepoConfig>>} />;
    }
  };

  const getProviderConfig = (provider: string) => {
    switch (provider) {
      case "filesystem":
        return fileSystemRepoConfigDefault;
      case "gcs":
        return googleCloudStorageRepoConfigDefault;
      case "s3":
        return amazonS3RepoConfigDefault;
      case "b2":
        return backblazeB2RepoConfigDefault;
      case "azureBlob":
        return azureBlobStorageRepoConfigDefault;
      case "sftp":
        return sftRepoConfigDefault;
      case "rclone":
        return rcloneRepoConfigDefault;
      case "webdav":
        return webDavRepoConfigDefault;
      case "_server":
        return kopiaRepoServerRepoConfigDefault;
      case "_token":
        return kopiaRepoTokenRepoConfigDefault;
    }
  };

  const validateConfig = () => {
    if (form.values.provider === "_token" || form.values.provider === "_server") {
      form.setFieldValue("confirmCreate", false);
      setActive(2);
      return;
    }

    const request = {
      storage: {
        type: form.values.provider!,
        config: form.values.providerConfig!
      }
    };
    checkRepoAction.execute(request);
  };

  return (
    <Container>
      <Paper withBorder p="md" pos="relative">
        <ErrorAlert error={checkRepoAction.error} />
        <Stepper active={active} size="xs">
          <Stepper.Step label={t`Select Provider`} description={t`Select the preferred storage type`}>
            <SimpleGrid cols={2}>
              {supportedProviders.map((p) => {
                return (
                  <UnstyledButton
                    key={p.provider}
                    onClick={() => {
                      form.setFieldValue("provider", p.provider);
                      form.setFieldValue("providerConfig", getProviderConfig(p.provider));
                      form.clearErrors();
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
          <Stepper.Step label={t`Configure Provider`} description={t`Configure the selected provider`}>
            {getProvider()}
            <Group mt="sm" justify="space-between">
              <Button
                onClick={() => {
                  form.setFieldValue("provider", "");
                  setActive(0);
                }}
                size="xs"
              >
                <Trans>Back</Trans>
              </Button>
              <Button size="xs" onClick={validateConfig} disabled={!form.isValid("providerConfig")}>
                <Trans>Next</Trans>
              </Button>
            </Group>
          </Stepper.Step>
          <Stepper.Step
            label={form.values.confirmCreate ? t`Create repository` : t`Configure repository`}
            description={form.values.confirmCreate ? t`Create a new repository` : t`Configure the repository`}
          >
            {form.values.confirmCreate && (
              <CreateRepoSection
                form={form}
                goBack={() => {
                  setActive(1);
                }}
              />
            )}
            {!form.values.confirmCreate && (
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
