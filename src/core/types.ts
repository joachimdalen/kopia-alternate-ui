export interface ApiResponse<T> {
  isError: boolean;
  data?: T;
  responseCode: number;
  originResponseCode?: number;
}

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
  summ: DirectorySummary;
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
