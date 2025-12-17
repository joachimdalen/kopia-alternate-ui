export type RepoConfigurationForm<T> = {
  provider: string;
  providerConfig: T;
  username: string;
  hostname: string;
  password: string;
  confirmPassword: string;
  encryption: string;
  hash: string;
  splitter: string;
  formatVersion: string;
  eccOverheadPercent: string;
  ecc: string;
  readonly: boolean;
  description: string;
};
export type FileSystemRepoConfig = {
  path: string;
};
export type AmazonS3RepoConfig = {
  bucket: string;
  endpoint: string;
  region?: string;
  doNotUseTLS: boolean;
  doNotVerifyTLS: boolean;
  accessKeyID: string;
  secretAccessKey: string;
  sessionToken?: string;
  prefix?: string;
};
export type AzureBlobStorageRepoConfig = {
  container: string;
  prefix?: string;
  storageAccount: string;
  storageKey?: string;
  storageDomain?: string;
  sasToken?: string;
};
export type BackblazeB2RepoConfig = {
  bucket: string;
  keyId: string;
  key: string;
  prefix?: string;
};
export type GoogleCloudStorageRepoConfig = {
  bucket: string;
  prefix?: string;
  credentialsFile?: string;
  credentials?: string;
};
export type KopiaRepoServerRepoConfig = {
  url: string;
  serverCertFingerprint?: string;
};
export type KopiaRepoTokenRepoConfig = {
  token: string;
};
export type RcloneRepoConfig = {
  remotePath: string;
  rcloneExe?: string;
};

export type SftpRepoConfig = {
  host: string;
  username: string;
  port?: number;
  path: string;

  password?: string;
  keyfile?: string;
  knownhostsFile?: string;
  keyData?: string;
  knownHostsData?: string;

  externalSSH: boolean;
  sshCommand?: string;
  sshArguments?: string;
};

export type WebDavRepoConfig = {
  url: string;
  username?: string;
  password?: string;
};
