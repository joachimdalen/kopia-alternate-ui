export type RepoConfigurationForm<T> = {
  provider?: string;
  providerConfig?: T;
  username?: string;
  hostname?: string;
  password?: string;
  confirmPassword?: string;
  encryption?: string;
  hash?: string;
  splitter?: string;
  formatVersion?: string;
  eccOverheadPercent?: string;
  ecc?: string;
  readonly?: boolean;
  description?: string;
  confirmCreate?: boolean;
};
