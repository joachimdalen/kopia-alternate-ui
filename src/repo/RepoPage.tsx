import {
  Button,
  Container,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import useApiRequest from "../core/hooks/useApiRequest";
import ConfigureRepoSection from "./ConfigureRepoSection";

function RepoPage() {
  const { kopiaService } = useServerInstanceContext();
  const { reloadStatus, repoStatus } = useAppContext();

  const disconnectRepoAction = useApiRequest({
    action: () => kopiaService.disconnectRepo(),
    onReturn() {
      reloadStatus();
    },
  });
  const updateDescriptionAction = useApiRequest({
    action: (data?: string) => kopiaService.updateRepoDescription(data!),
    onReturn() {
      reloadStatus();
    },
  });
  const field = useField({
    initialValue: repoStatus.description || "",
    validateOnBlur: true,
    validate: (value) =>
      value.trim().length < 2 ? "Value is too short" : null,
  });
  if (repoStatus.connected) {
    return (
      <Container>
        <Paper withBorder p="md">
          <Stack>
            <Group justify="space-between" align="flex-end">
              <Title order={1}>{repoStatus.description}</Title>
              <Button
                color="red"
                variant="light"
                onClick={() => {
                  disconnectRepoAction.execute();
                  reloadStatus();
                }}
                disabled={disconnectRepoAction.loading}
              >
                Disconnect
              </Button>
            </Group>
            <Group align="flex-end">
              <TextInput
                flex={1}
                label="Description"
                disabled={
                  updateDescriptionAction.loading ||
                  disconnectRepoAction.loading
                }
                {...field.getInputProps()}
              />
              <Button
                disabled={
                  field.getValue() === "" || disconnectRepoAction.loading
                }
                onClick={() =>
                  updateDescriptionAction.execute(field.getValue())
                }
                loading={updateDescriptionAction.loading}
              >
                Update
              </Button>
            </Group>
            <Divider />
            <SimpleGrid cols={2}>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Config File
                </Text>
                <Text fz="sm">{repoStatus.configFile || "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Provider
                </Text>
                <Text fz="sm">{repoStatus.storage || "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Encryption Algorithm
                </Text>
                <Text fz="sm">{repoStatus.encryption || "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Hash Algorithm
                </Text>
                <Text fz="sm">{repoStatus.hash || "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Splitter Algorithm
                </Text>
                <Text fz="sm">{repoStatus.splitter || "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Repository Format
                </Text>
                <Text fz="sm">
                  {repoStatus.formatVersion === "1"
                    ? "Legacy format compatible with v0.8"
                    : "Latest format"}
                </Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Error Correction Overhead
                </Text>
                <Text fz="sm">
                  {repoStatus.eccOverheadPercent === 0 ||
                  !repoStatus.eccOverheadPercent
                    ? "Disabled"
                    : `${repoStatus.eccOverheadPercent}%`}
                </Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Error Correction Algorithm
                </Text>
                <Text fz="sm">{repoStatus.ecc ? repoStatus.ecc : "-"}</Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Internal Compression
                </Text>
                <Text fz="sm">
                  {repoStatus.supportsContentCompression ? "Yes" : "No"}
                </Text>
              </Stack>
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Connected as
                </Text>
                <Text fz="sm">{`${repoStatus.username}@${repoStatus.hostname}`}</Text>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return <ConfigureRepoSection />;
}

export default RepoPage;
