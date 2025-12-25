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
import * as yup from "yup";
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
export const fileSystemSchema = yup.object({
  path: yup.string().required().label("Path")
});
export const amazonS3Schema = yup.object({
  bucket: yup.string().required().label("Path"),
  endpoint: yup.string().required().label("Endpoint"),
  accessKeyID: yup.string().required().label("Access Key ID"),
  secretAccessKey: yup.string().required().label("Secret Access Key")
});
export const azureBlobSchema = yup.object({
  container: yup.string().required().label("Container"),
  storageAccount: yup.string().required().label("Storage Account")
});
export const backblazeSchema = yup.object({
  bucket: yup.string().required().label("Bucket"),
  keyId: yup.string().required().label("Key ID"),
  key: yup.string().required().label("Key")
});
export const googleCloudSchema = yup.object({
  bucket: yup.string().required().label("Bucket")
});
export const kopiaRepoServerSchema = yup.object({
  url: yup.string().required().label("URL")
});
export const kopiaRepoTokenSchema = yup.object({
  token: yup.string().required().label("Token")
});
export const rcloneSchema = yup.object({
  remotePath: yup.string().required().label("Remote path")
});
export const sftpSchema = yup.object({
  host: yup.string().required().label("Host"),
  port: yup.number().required().label("Port"),
  username: yup.string().required().label("Username"),
  path: yup.string().required().label("Path")

  // TODO: validate oneof "password", "keyfile", "keyData"
  // TODO: validate oneof "knownHostsFile", "knownHostsData"
});
