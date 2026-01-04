import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Alert,
  Button,
  Card,
  CardSection,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import { useField } from "@mantine/form";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCircleCheck, IconEditOff } from "@tabler/icons-react";
import { useAppContext } from "../../core/context/AppContext";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import useApiRequest from "../../core/hooks/useApiRequest";
import IconWrapper from "../../core/IconWrapper";
import { AmazonS3RepoHeader } from "../sections/AmazonS3Repo";
import { AzureBlobStorageRepoHeader } from "../sections/AzureBlobStorageRepo";
import { BackblazeB2RepoHeader } from "../sections/BackblazeB2Repo";
import { FileSystemRepoHeader } from "../sections/FileSystemRepo";
import { GoogleCloudStorageRepoHeader } from "../sections/GoogleCloudStorageRepo";
import { KopiaRepoServerRepoHeader } from "../sections/KopiaRepoServerRepo";
import { KopiaRepoTokenRepoHeader } from "../sections/KopiaRepoTokenRepo";
import { RcloneRepoHeader } from "../sections/RcloneRepo";
import { SFTPServerRepoHeader } from "../sections/SFTPServerRepo";
import { WebDavRepoHeader } from "../sections/WebDavRepo";
import classes from "./ConnectedRepoSection.module.css";

const headers: Record<string, React.ReactNode> = {
  filesystem: <FileSystemRepoHeader />,
  gcs: <GoogleCloudStorageRepoHeader />,
  s3: <AmazonS3RepoHeader />,
  b2: <BackblazeB2RepoHeader />,
  azureBlob: <AzureBlobStorageRepoHeader />,
  sftp: <SFTPServerRepoHeader />,
  rclone: <RcloneRepoHeader />,
  webdav: <WebDavRepoHeader />,
  _server: <KopiaRepoServerRepoHeader />,
  _token: <KopiaRepoTokenRepoHeader />
};

function ConnectedRepoSection() {
  const { kopiaService } = useServerInstanceContext();
  const { reloadStatus, repoStatus } = useAppContext();
  const disconnectRepoAction = useApiRequest({
    showErrorAsNotification: true,
    action: () => kopiaService.disconnectRepo(),
    onReturn() {
      showNotification({
        title: t`Repository disconnected`,
        message: t`The repository was successfully disconnected`,
        color: "green",
        icon: <IconCircleCheck size={16} />
      });
      reloadStatus();
    }
  });
  const updateDescriptionAction = useApiRequest({
    action: (data?: string) => kopiaService.updateRepoDescription(data!),
    onReturn() {
      showNotification({
        title: t`Description updated`,
        message: t`The repository description was successfully updated`,
        color: "green",
        icon: <IconCircleCheck size={16} />
      });
      reloadStatus();
    }
  });
  const field = useField({
    initialValue: repoStatus.description || "",
    validateOnBlur: true,
    validate: (value) => (value.trim().length < 2 ? "Value is too short" : null)
  });

  const openDisconnectConfirmation = () =>
    modals.openConfirmModal({
      title: t`Disconnect repository?`,
      children: (
        <Text size="sm">
          <Trans>Are you sure you want to disconnect from this repository?</Trans>
        </Text>
      ),
      labels: { confirm: t`Disconnect`, cancel: t`Cancel` },
      confirmProps: { color: "red", size: "xs" },
      cancelProps: { size: "xs" },
      onConfirm: () => disconnectRepoAction.execute()
    });
  return (
    <Container>
      <Card withBorder radius="xs" className={classes.connectedRepoSection}>
        <CardSection withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Stack>{(repoStatus?.storage && headers[repoStatus.storage]) || <KopiaRepoServerRepoHeader />}</Stack>
            <Button
              color="red"
              variant="light"
              onClick={openDisconnectConfirmation}
              loading={disconnectRepoAction.loading}
              disabled={disconnectRepoAction.loading}
            >
              <Trans>Disconnect</Trans>
            </Button>
          </Group>
        </CardSection>
        <CardSection p="xs">
          <Stack>
            <Group align="flex-end">
              <TextInput
                flex={1}
                label={t`Description`}
                disabled={updateDescriptionAction.loading || disconnectRepoAction.loading}
                {...field.getInputProps()}
              />
              <Button
                disabled={
                  field.getValue() === "" || disconnectRepoAction.loading || field.getValue() === repoStatus.description
                }
                onClick={() => updateDescriptionAction.execute(field.getValue())}
                loading={updateDescriptionAction.loading}
              >
                <Trans>Update</Trans>
              </Button>
            </Group>
            <Divider />
            {repoStatus.readonly && (
              <Alert color="orange">
                <Group>
                  <IconWrapper icon={IconEditOff} size={18} />
                  <Text fw="bold">
                    <Trans>Repository is connected as read-only</Trans>
                  </Text>
                </Group>
              </Alert>
            )}
            <SimpleGrid cols={2}>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  <Trans>Config file</Trans>
                </Text>
                <Text fz="sm">{repoStatus.configFile || "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  <Trans>Provider</Trans>
                </Text>
                <Text fz="sm">{repoStatus.storage || "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  <Trans>Encryption Algorithm</Trans>
                </Text>
                <Text fz="sm">{repoStatus.encryption || "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  <Trans>Hash Algorithm</Trans>
                </Text>
                <Text fz="sm">{repoStatus.hash || "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  <Trans>Splitter Algorithm</Trans>
                </Text>
                <Text fz="sm">{repoStatus.splitter || "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  <Trans>Repository Format</Trans>
                </Text>
                <Text fz="sm">
                  {repoStatus.formatVersion === "1" ? t`Legacy format compatible with v0.8` : t`Latest format`}
                </Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  <Trans>Error Correction Overhead</Trans>
                </Text>
                <Text fz="sm">
                  {repoStatus.eccOverheadPercent === 0 || !repoStatus.eccOverheadPercent
                    ? t`Disabled`
                    : `${repoStatus.eccOverheadPercent}%`}
                </Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  <Trans>Error Correction Algorithm</Trans>
                </Text>
                <Text fz="sm">{repoStatus.ecc ? repoStatus.ecc : "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  <Trans>Internal Compression</Trans>
                </Text>
                <Text fz="sm">{repoStatus.supportsContentCompression ? t`Yes` : t`No`}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  <Trans>Connected as</Trans>
                </Text>
                <Text fz="sm">{`${repoStatus.username}@${repoStatus.hostname}`}</Text>
              </Stack>
            </SimpleGrid>
          </Stack>
        </CardSection>
      </Card>
    </Container>
  );
}

export default ConnectedRepoSection;
