import {
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
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
}

export default RepoPage;
