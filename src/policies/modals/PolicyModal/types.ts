import type { LooseKeys, UseFormReturnType } from "@mantine/form";
import type { SourceInfo, TimeOfDay } from "../../../core/types";

export type PolicyInput = {
  form: UseFormReturnType<PolicyForm>;
  formKey: LooseKeys<PolicyForm>;
  effectiveDefinedIn?: SourceInfo;
};
export type PolicyForm = {
  retention?: PolicyFormRetention;
  files?: PolicyFormFiles;
  errorHandling?: PolicyFormErrorHandling;
  scheduling?: PolicyFormScheduling;
  compression?: PolicyFormCompression;
  metadataCompression?: PolicyFormMetadataCompression;
  splitter?: PolicyFormSplitter;
  actions?: PolicyFormActions;
  osSnapshots?: PolicyFormOSSnapshot;
  logging?: PolicyFormLogging;
  upload?: PolicyFormUpload;
  noParent?: boolean;
};
type PolicyFormRetention = {
  keepLatest?: number;
  keepHourly?: number;
  keepDaily?: number;
  keepWeekly?: number;
  keepMonthly?: number;
  keepAnnual?: number;
  ignoreIdenticalSnapshots?: boolean;
};
export type PolicyFormFiles = {
  ignore?: string[];
  noParentIgnore?: boolean;
  ignoreDotFiles?: string[];
  noParentDotFiles?: boolean;
  ignoreCacheDirs?: boolean;
  maxFileSize?: number;
  oneFileSystem?: boolean;
};
export type PolicyFormErrorHandling = {
  ignoreFileErrors?: boolean;
  ignoreDirectoryErrors?: boolean;
  ignoreUnknownTypes?: boolean;
};
export type PolicyFormScheduling = {
  intervalSeconds?: number;
  timeOfDay?: TimeOfDay[];
  noParentTimeOfDay?: boolean;
  manual?: boolean;
  cron?: string[];
  runMissed?: boolean;
};
export type PolicyFormCompression = {
  compressorName?: string;
  onlyCompress?: string[];
  noParentOnlyCompress?: boolean;
  neverCompress?: string[];
  noParentNeverCompress?: boolean;
  minSize?: number;
  maxSize?: number;
};
export type PolicyFormMetadataCompression = {
  compressorName?: string;
};
export type PolicyFormSplitter = {
  algorithm?: string;
};
export type PolicyFormActions = {
  beforeFolder?: PolicyFormActionCommand;
  afterFolder?: PolicyFormActionCommand;
  beforeSnapshotRoot?: PolicyFormActionCommand;
  afterSnapshotRoot?: PolicyFormActionCommand;
};
export type PolicyFormActionCommand = {
  path?: string;
  args?: string[];
  script?: string;
  timeout?: number;
  mode?: string;
};
export type PolicyFormOSSnapshot = {
  volumeShadowCopy?: PolicyFormVolumeShadowCopy;
};
export type PolicyFormVolumeShadowCopy = {
  enable?: number;
};
export type PolicyFormLogging = {
  directories?: PolicyFormDirLogging;
  entries?: PolicyFormEntryLogging;
};
export type PolicyFormDirLogging = {
  snapshotted?: number;
  ignored?: number;
};
export type PolicyFormEntryLogging = {
  snapshotted?: number;
  ignored?: number;
  cacheHit?: number;
  cacheMiss?: number;
};
export type PolicyFormUpload = {
  maxParallelSnapshots?: number;
  maxParallelFileReads?: number;
  parallelUploadAboveSize?: number;
};
