export interface ApiResponse<T> {
  isError: boolean;
  data?: T;
  responseCode: number;
  originResponseCode?: number;
}

export type ItemAction<T, TO> = {
  item?: T;
  action: TO;
};

export type SourceInfo = {
  host: string;
  userName: string;
  path: string;
};
export type Stats = {
  totalSize: number;
  excludedTotalSize: number;
  fileCount: number;
  cachedFiles: number;
  nonCachedFiles: number;
  dirCount: number;
  excludedFileCount: number;
  excludedDirCount: number;
  ignoredErrorCount: number;
  errorCount: number;
};

export type Sources = {
  localUsername: string;
  localHost: string;
  multiUser: boolean;
  sources: SourceStatus[];
};
export type TimeOfDay = { hour: number; min: number };
export type SchedulingPolicy = {
  intervalSeconds?: number;
  timeOfDay?: TimeOfDay[];
  noParentTimeOfDay?: boolean;
  manual?: boolean;
  cron?: string[];
  runMissed: boolean;
};
export type DirEntry = {
  name: string;
  type: string;
  mode: string;
  mtime: string;
  obj: string;
  summ?: DirectorySummary;
};
export type DirectorySummary = {
  size: number;
  files: number;
  symlinks: number;
  dirs: number;
  maxTime: string;
  numFailed: number;
  incomplete?: string;
  ignoredErrorCount?: number;
  failedEntries?: EntryWithError[];
};
export type EntryWithError = {
  path: string;
  error: string;
};
export type SnapShotManifest = {
  id: string;
  source: SourceInfo;
  description: string;
  startTime: string;
  endTime: string;
  stats: Stats;
  rootEntry: DirEntry;
};
export type SourceStatus = {
  source: SourceInfo;
  status: string;
  schedule: SchedulingPolicy;
  lastSnapshot?: SnapShotManifest;
  nextSnapshotTime?: string;
  upload?: UploadCounters;
  currentTask?: string;
};
export type UploadCounters = {
  cachedBytes: number;
  hashedBytes: number;
  uploadedBytes: number;
  estimatedBytes: number;
  cachedFiles: number;
  hashedFiles: number;
  excludedFiles: number;
  excludedDirs: number;
  errors: number;
  ignoredErrors: number;
  estimatedFiles: number;
  directory: string;
  lastErrorPath: string;
  lastError: string;
};
export type Snapshot = {
  id: string;
  description: string;
  startTime: string;
  endTime: string;
  incomplete?: string;
  summary: DirectorySummary;
  rootID: string;
  retention: string[];
  pins: string[];
};

export type Snapshots = {
  snapshots: Snapshot[];
  unfilteredCount: number;
  uniqueCount: number;
};

export type DirManifest = {
  steam: string;
  entries: DirEntry[];
  summary: DirectorySummary;
};

export type RestoreBase = {
  root: string;
  options: RestoreOptions;
};

export type RestoreOptions = {
  incremental: boolean;
  ignoreErrors: boolean;
  restoreDirEntryAtDepth: number;
  minSizeForPlaceholder: number;
};

export type RestoreZip = {
  zipFile: string;
  uncompressedZip: boolean;
} & RestoreBase;

export type RestoreTar = {
  tarFile: string;
} & RestoreBase;

export type RestoreDirectory = {
  fsOutput: {
    targetPath: string;
    skipOwners: boolean;
    skipPermissions: boolean;
    skipTimes: boolean;
    ignorePermissionErrors: boolean;
    overwriteFiles: boolean;
    overwriteDirectories: boolean;
    overwriteSymlinks: boolean;
    writeFilesAtomically: boolean;
    writeSparseFiles: boolean;
  };
} & RestoreBase;

export type RestoreRequest = RestoreZip | RestoreTar | RestoreDirectory;

export type TaskList = {
  tasks: Task[];
};
export type Task = {
  id: string;
  startTime: string;
  endTime?: string;
  kind: string;
  description: string;
  status: string;
  progressInfo: string;
  errorMessage?: string;
  counters: {
    "Cached Bytes"?: {
      value: number;
      units: "bytes";
      level: string;
    };
    "Cached Files"?: {
      value: number;
      level: string;
    };
    Errors?: {
      value: number;
      level: string;
    };
    "Excluded Directories"?: {
      value: number;
      level: string;
    };
    "Excluded Files"?: {
      value: number;
      level: string;
    };
    "Hashed Bytes"?: {
      value: number;
      units: "bytes";
      level: string;
    };
    "Hashed Files"?: {
      value: number;
      level: string;
    };
    "Processed Bytes"?: {
      value: number;
      units: "bytes";
      level: string;
    };
    "Processed Files"?: {
      value: number;
      level: string;
    };
    "Uploaded Bytes"?: {
      value: number;
      units: "bytes";
      level: string;
    };
    "Ignored Errors"?: {
      value: number;
      level: string;
    };
    "Restored Bytes"?: {
      value: number;
      units: "bytes";
      level: string;
    };
    "Restored Directories"?: {
      value: number;
      level: string;
    };
    "Restored Files"?: {
      value: number;
      level: string;
    };
    "Restored Symlinks"?: {
      value: number;
      level: string;
    };
    "Skipped Bytes"?: {
      value: number;
      units: "bytes";
      level: string;
    };
    "Skipped Files"?: {
      value: number;
      level: string;
    };
  };
  logLine: string[];
  error: string;
  sequenceNumber?: number;
};

export type Status = {
  connected: boolean;
  configFile?: string;
  formatVersion?: string;
  hash?: string;
  encryption?: string;
  ecc?: string;
  eccOverheadPercent?: number;
  splitter?: string;
  maxPackSize?: number;
  storage?: string;
  apiServerURL?: string;
  supportsContentCompression: boolean;
} & ClientOptions;

type ClientOptions = {
  hostname: string;
  username: string;
  readOnly?: boolean;
  permissiveCacheLoading?: boolean;
  description?: string;
  enableActions: boolean;
  formatBlobCacheDuration?: string;
  throttlingLimits?: {
    readsPerSecond?: number;
    writesPerSecond?: number;
    listsPerSecond?: number;
    maxUploadSpeedBytesPerSecond?: number;
    maxDownloadSpeedBytesPerSecond?: number;
    concurrentReads?: number;
    concurrentWrites?: number;
  };
};

export type PoliciesList = {
  policies: PolicyRef[];
};

export type PolicyRef = {
  id: string;
  target: SourceInfo;
  policy: Policy;
};
export type Policy = {
  retention?: RetentionPolicy;
  files?: FilesPolicy;
  errorHandling?: ErrorHandlingPolicy;
  scheduling?: SchedulingPolicy;
  compression?: CompressionPolicy;
  metadataCompression?: MetadataCompressionPolicy;
  splitter?: SplitterPolicy;
  actions?: ActionsPolicy;
  osSnapshots?: OSSnapshotPolicy;
  logging?: LoggingPolicy;
  upload?: UploadPolicy;
  noParent?: boolean;
};
export type RetentionPolicy = {
  keepLatest?: number;
  keepHourly?: number;
  keepDaily?: number;
  keepWeekly?: number;
  keepMonthly?: number;
  keepAnnual?: number;
  ignoreIdenticalSnapshots?: boolean;
};
export type FilesPolicy = {
  ignore?: string[];
  noParentIgnore?: boolean;
  ignoreDotFiles?: string[];
  noParentDotFiles?: boolean;
  ignoreCacheDirs?: boolean;
  maxFileSize?: number;
  oneFileSystem?: boolean;
};
export type ErrorHandlingPolicy = {
  ignoreFileErrors?: boolean;
  ignoreDirectoryErrors?: boolean;
  ignoreUnknownTypes?: boolean;
};
export type CompressionPolicy = {
  compressorName?: string;
  onlyCompress?: string[];
  noParentOnlyCompress?: boolean;
  neverCompress?: string[];
  noParentNeverCompress?: boolean;
  minSize?: number;
  maxSize?: number;
};
export type MetadataCompressionPolicy = {
  compressorName?: string;
  // onlyCompress?: string[];
  // noParentOnlyCompress?: boolean;
  // neverCompress?: string[];
  // noParentNeverCompress?: boolean;
  // minSize?: number;
  // maxSize?: number;
};
export type SplitterPolicy = {
  algorithm?: string;
};
export type ActionsPolicy = {
  beforeFolder?: ActionCommand;
  afterFolder?: ActionCommand;
  beforeSnapshotRoot?: ActionCommand;
  afterSnapshotRoot?: ActionCommand;
};
export type ActionCommand = {
  path?: string;
  args?: string[];
  script?: string;
  timeout?: number;
  mode?: string;
};
export type OSSnapshotPolicy = {
  volumeShadowCopy?: VolumeShadowCopyPolicy;
};
export type VolumeShadowCopyPolicy = {
  enable?: number;
};
export type LoggingPolicy = {
  directories?: DirLoggingPolicy;
  entries?: EntryLoggingPolicy;
};

export type DirLoggingPolicy = {
  snapshotted?: number;
  ignored?: number;
};
export type EntryLoggingPolicy = {
  snapshotted?: number;
  ignored?: number;
  cacheHit?: number;
  cacheMiss?: number;
};

export type UploadPolicy = {
  maxParallelSnapshots?: number;
  maxParallelFileReads?: number;
  parallelUploadAboveSize?: number;
};

export type AlgorithmsList = {
  compression: { id: string; deprecated: boolean }[];
  ecc: { id: string; deprecated: boolean }[];
  encryption: { id: string; deprecated: boolean }[];
  hash: { id: string; deprecated: boolean }[];
  splitter: { id: string; deprecated: boolean }[];
  defaultEcc: string;
  defaultEncryption: string;
  defaultHash: string;
  defaultSplitter: string;
};
export type ResolvePolicyRequest = {
  numUpcomingSnapshotTimes: number;
  updates: Policy;
};

export type ResolvedPolicy = {
  effective: Policy;
  definition: PolicyDefinition;
  defined: Policy;
  upcomingSnapshotTimes: string[];
  schedulingError?: string;
};

export type PolicyDefinition = {
  retention?: RetentionPolicyDefinition;
  files?: FilesPolicyDefinition;
  errorHandling?: ErrorHandlingPolicyDefinition;
  scheduling?: SchedulingPolicyDefinition;
  compression?: CompressionPolicyDefinition;
  metadataCompression?: MetadataCompressionPolicyDefinition;
  splitter?: SplitterPolicyDefinition;
  actions?: ActionsPolicyDefinition;
  osSnapshots?: OSSnapshotPolicyDefinition;
  logging?: LoggingPolicyDefinition;
  upload?: UploadPolicyDefinition;
};

export type RetentionPolicyDefinition = {
  keepLatest?: SourceInfo;
  keepHourly?: SourceInfo;
  keepDaily?: SourceInfo;
  keepWeekly?: SourceInfo;
  keepMonthly?: SourceInfo;
  keepAnnual?: SourceInfo;
  ignoreIdenticalSnapshots?: SourceInfo;
};
type FilesPolicyDefinition = {
  ignore?: SourceInfo;
  noParentIgnore?: SourceInfo;
  ignoreDotFiles?: SourceInfo;
  noParentDotFiles?: SourceInfo;
  ignoreCacheDirs?: SourceInfo;
  maxFileSize?: SourceInfo;
  oneFileSystem?: SourceInfo;
};
type ErrorHandlingPolicyDefinition = {
  ignoreFileErrors?: SourceInfo;
  ignoreDirectoryErrors?: SourceInfo;
  ignoreUnknownTypes?: SourceInfo;
};
type SchedulingPolicyDefinition = {
  intervalSeconds?: SourceInfo;
  timeOfDay?: SourceInfo;
  noParentTimeOfDay?: SourceInfo;
  manual?: SourceInfo;
  cron?: SourceInfo;
  runMissed: SourceInfo;
};
type CompressionPolicyDefinition = {
  compressorName?: SourceInfo;
  onlyCompress?: SourceInfo;
  noParentOnlyCompress?: SourceInfo;
  neverCompress?: SourceInfo;
  noParentNeverCompress?: SourceInfo;
  minSize?: SourceInfo;
  maxSize?: SourceInfo;
};
type MetadataCompressionPolicyDefinition = {
  compressorName?: SourceInfo;
};
type SplitterPolicyDefinition = {
  algorithm?: SourceInfo;
};
type ActionsPolicyDefinition = {
  beforeSnapshotRoot?: SourceInfo;
  afterSnapshotRoot?: SourceInfo;
};
type OSSnapshotPolicyDefinition = {
  volumeShadowCopy?: SourceInfo;
};
type LoggingPolicyDefinition = {
  directories?: DirLoggingPolicyDefinition;
  entries?: EntryLoggingPolicyDefinition;
};
type DirLoggingPolicyDefinition = {
  snapshotted?: SourceInfo;
  ignored?: SourceInfo;
};
type EntryLoggingPolicyDefinition = {
  snapshotted?: SourceInfo;
  ignored?: SourceInfo;
  cacheHit?: SourceInfo;
  cacheMiss?: SourceInfo;
};
type UploadPolicyDefinition = {
  maxParallelSnapshots?: SourceInfo;
  maxParallelFileReads?: SourceInfo;
  parallelUploadAboveSize?: SourceInfo;
};
export type TasksSummary = {
  CANCELED: number;
  RUNNING: number;
  SUCCESS: number;
};

export type Preferences = {
  bytesStringBase2: boolean;
  defaultSnapshotViewAll: boolean;
  theme: string;
  fontSize: string;
  pageSize: number;
  language: string;
};
export type NotificationType = "webhook" | "pushover" | "email";
export type NotificationConfig =
  | WebhookNotification
  | PushOverNotification
  | EmailNotification;
export type NotificationProfile = {
  profile: string;
  method: {
    type: NotificationType;
    config: NotificationConfig;
  };
  minSeverity: number;
};

export type WebhookNotification = {
  endpoint: string;
  method: string;
  format: "html" | "txt";
  headers: string;
};
export type PushOverNotification = {
  appToken: string;
  userKey: string;
  format: "html" | "txt";
  endpoint?: string;
};
export type EmailNotification = {
  smtpServer: string;
  smtpPort: number;
  smtpIdentity?: string;
  smtpUsername: string;
  smtpPassword: string;
  from: string;
  to: string;
  cc: string;
  format: "html" | "txt";
};
