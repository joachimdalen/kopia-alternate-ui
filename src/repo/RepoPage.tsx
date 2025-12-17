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

function RepoPage() {
  const [selected, setSelected] = useState<string>("");
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const getProvider = () => {
    switch (selected) {
      case "filesystem":
        return <FileSystemRepo />;
      case "gcs":
        return <GoogleCloudStorageRepo />;
      case "s3":
        return <AmazonS3Repo />;
      case "b2":
        return <BackblazeB2Repo />;
      case "azureBlob":
        return <AzureBlobStorageRepo />;
      case "sftp":
        return <SFTPServerRepo />;
      case "rclone":
        return <RcloneRepo />;
      case "webdav":
        return <WebDavRepo />;
      case "_server":
        return <KopiaRepoServerRepo />;
      case "_token":
        return <KopiaRepoTokenRepo />;
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
                      setSelected(p.provider);
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
                />
                <PasswordInput
                  label="Confirm Repository Password"
                  description="Confirm the repository password"
                  withAsterisk
                  placeholder="Enter repository password again"
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
                        />
                        <Select
                          label="Hash Algorithm"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
                        />
                      </Group>
                      <Group grow>
                        <Select
                          label="Splitter"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
                        />
                        <Select
                          label="Repository Format"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
                        />
                      </Group>
                      <Group grow>
                        <Select
                          label="Error Correction Overhead"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
                        />
                        <Select
                          label="Error Correction Algorithm"
                          data={[]}
                          allowDeselect={false}
                          withCheckIcon={false}
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
