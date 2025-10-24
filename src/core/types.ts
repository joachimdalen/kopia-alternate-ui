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
export type SchedulingPolicy = {
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
  nextSnapshot?: string;
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
    "Cached Bytes": {
      value: number;
      units: "bytes";
      level: string;
    };
    "Cached Files": {
      value: number;
      level: string;
    };
    Errors: {
      value: number;
      level: string;
    };
    "Excluded Directories": {
      value: number;
      level: string;
    };
    "Excluded Files": {
      value: number;
      level: string;
    };
    "Hashed Bytes": {
      value: number;
      units: "bytes";
      level: string;
    };
    "Hashed Files": {
      value: number;
      level: string;
    };
    "Processed Bytes": {
      value: number;
      units: "bytes";
      level: string;
    };
    "Processed Files": {
      value: number;
      level: string;
    };
    "Uploaded Bytes": {
      value: number;
      units: "bytes";
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
