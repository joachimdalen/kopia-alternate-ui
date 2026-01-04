import type { MantineColor } from "@mantine/core";
import {
  IconAsterisk,
  IconBrandAmazon,
  IconBrandAzure,
  IconBrandGoogleDrive,
  IconCloudComputing,
  IconFolder,
  IconFolderOpen,
  IconInfoCircle,
  IconRefresh,
  IconServer,
  IconServer2
} from "@tabler/icons-react";
export const supportedProviders: {
  provider: string;
  description: string;
  color: MantineColor;
  icon: typeof IconCloudComputing;
}[] = [
  {
    provider: "filesystem",
    description: "Local Directory or NAS",
    icon: IconFolderOpen,
    color: "orange"
  },
  {
    provider: "gcs",
    description: "Google Cloud Storage",
    icon: IconBrandGoogleDrive,
    color: "yellow"
  },
  {
    provider: "s3",
    description: "Amazon S3 or Compatible Storage",
    icon: IconBrandAmazon,
    color: "orange"
  },
  {
    provider: "b2",
    description: "Backblaze B2",
    icon: IconInfoCircle,
    color: "red"
  },
  {
    provider: "azureBlob",
    description: "Azure Blob Storage",
    icon: IconBrandAzure,
    color: "blue"
  },
  {
    provider: "sftp",
    description: "SFTP Server",
    icon: IconServer2,
    color: "teal"
  },
  {
    provider: "rclone",
    description: "Rclone Remote",
    icon: IconRefresh,
    color: "grape"
  },
  {
    provider: "webdav",
    description: "WebDAV Server",
    icon: IconFolder,
    color: "indigo"
  },
  {
    provider: "_server",
    description: "Kopia Repository Server",
    icon: IconServer,
    color: "lime"
  },
  {
    provider: "_token",
    description: "Use Repository Token",
    icon: IconAsterisk,
    color: "violet"
  }
];
