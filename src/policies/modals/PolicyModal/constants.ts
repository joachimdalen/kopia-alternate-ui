import { t } from "@lingui/core/macro";
import { array, boolean, number, type ObjectSchema, object, string } from "yup";
import type { PolicyForm } from "./types";
export const defaultForm: PolicyForm = {
  retention: {
    keepLatest: undefined,
    keepHourly: undefined,
    keepDaily: undefined,
    keepWeekly: undefined,
    keepMonthly: undefined,
    keepAnnual: undefined,
    ignoreIdenticalSnapshots: undefined
  },
  files: {
    ignore: [],
    noParentIgnore: undefined,
    ignoreDotFiles: [],
    noParentDotFiles: undefined,
    ignoreCacheDirs: undefined,
    maxFileSize: undefined,
    oneFileSystem: undefined
  },
  errorHandling: {
    ignoreFileErrors: undefined,
    ignoreDirectoryErrors: undefined,
    ignoreUnknownTypes: undefined
  },
  scheduling: {
    intervalSeconds: undefined,
    timeOfDay: [],
    noParentTimeOfDay: undefined,
    manual: undefined,
    cron: [],
    runMissed: undefined
  },
  compression: {
    compressorName: "",
    onlyCompress: [],
    noParentOnlyCompress: undefined,
    neverCompress: [],
    noParentNeverCompress: undefined,
    minSize: undefined,
    maxSize: undefined
  },
  metadataCompression: {
    compressorName: ""
  },
  splitter: {
    algorithm: ""
  },
  actions: {
    beforeFolder: {
      args: [],
      mode: "",
      path: "",
      script: "",
      timeout: undefined
    },
    afterFolder: {
      args: [],
      mode: "",
      path: "",
      script: "",
      timeout: undefined
    },
    beforeSnapshotRoot: {
      args: [],
      mode: "",
      path: "",
      script: "",
      timeout: undefined
    },
    afterSnapshotRoot: {
      args: [],
      mode: "",
      path: "",
      script: "",
      timeout: undefined
    }
  },
  osSnapshots: {
    volumeShadowCopy: {
      enable: undefined
    }
  },
  logging: {
    directories: {
      ignored: undefined,
      snapshotted: undefined
    },
    entries: {
      cacheHit: undefined,
      cacheMiss: undefined
    }
  },
  upload: {
    maxParallelFileReads: undefined,
    maxParallelSnapshots: undefined,
    parallelUploadAboveSize: undefined
  },
  noParent: undefined
};

export const policyFormSchema: ObjectSchema<PolicyForm> = object({
  retention: object({
    keepLatest: number().optional().label(t`Latest Snapshots`),
    keepHourly: number().optional().label(t`Hourly`),
    keepDaily: number().optional().label(t`Daily`),
    keepWeekly: number().optional().label(t`Weekly`),
    keepMonthly: number().optional().label(t`Monthly`),
    keepAnnual: number().optional().label(t`Annual`),
    ignoreIdenticalSnapshots: boolean().optional().label(t`Ignore Identical Snapshots`)
  }).optional(),
  files: object({
    ignore: array().of(string().required()).optional().label(t`Ignore Files`),
    noParentIgnore: boolean().optional().label(t`Ignore Rules From Parent Directories`),
    ignoreDotFiles: array().of(string().required()).optional().label(t`Ignore Rule Files`),
    noParentDotFiles: boolean().optional().label(t`Ignore Rule Files From Parent Directories`),
    ignoreCacheDirs: boolean().optional().label(t`Ignore Well-Known Cache Directories`),
    maxFileSize: number().optional().label(t`Ignore Files larger than`),
    oneFileSystem: boolean().optional().label(t`Scan only one filesystem`)
  }).optional(),
  errorHandling: object({
    ignoreFileErrors: boolean().optional().label(t`Ignore File Errors`),
    ignoreDirectoryErrors: boolean().optional().label(t`Ignore Directory Errors`),
    ignoreUnknownTypes: boolean().optional().label(t`Ignore Unknown Directory Entries`)
  }).optional(),
  scheduling: object({
    intervalSeconds: number().optional().label(t`Snapshot Frequency`),
    timeOfDay: array()
      .of(
        object({
          hour: number().required(),
          min: number().required()
        }).required()
      )
      .label(t`Time Of Day`), //TimeOfDay[];
    noParentTimeOfDay: boolean().optional(),
    manual: boolean().optional().label(t`Manual Snapshots Only`),
    cron: array().of(string().required()).optional().label(t`Cron Expressions`),
    runMissed: boolean().optional().label(t`Run Missed Snapshots on Startup`)
  }),
  compression: object({
    compressorName: string().optional().label(t`Compression Algorithm`),
    onlyCompress: array().of(string().required()).optional().label(t`Only Compress Extensions`),
    noParentOnlyCompress: boolean().optional(),
    neverCompress: array().of(string().required()).optional().label(t`Never Compress Extensions`),
    noParentNeverCompress: boolean().optional(),
    minSize: number().optional().label(t`Minimum File Size`),
    maxSize: number().optional().label(t`Max File Size`)
  }),
  metadataCompression: object({
    compressorName: string().optional()
  }).optional(),
  splitter: object({
    algorithm: string().optional()
  }).optional(),
  actions: object({
    beforeFolder: object({
      path: string().optional().trim(),
      args: array().of(string().required()).optional(),
      script: string().optional().label(t`Before Folder`),
      timeout: number().optional().label(t`Timeout - Before`),
      mode: string().optional().label(t`Command Mode - Before`)
    }).optional(),
    afterFolder: object({
      path: string().optional(),
      args: array().of(string().required()).optional(),
      script: string().optional().label(t`After Folder`),
      timeout: number().optional().label(t`Timeout - After`),
      mode: string().optional().label(t`Command Mode - After`)
    }).optional(),
    beforeSnapshotRoot: object({
      path: string().optional(),
      args: array().of(string().required()).optional(),
      script: string().optional().label(t`Before Snapshot`),
      timeout: number().optional().label(t`Timeout - Before`),
      mode: string().optional().label(t`Command Mode - Before`)
    }).optional(),
    afterSnapshotRoot: object({
      path: string().optional(),
      args: array().of(string().required()).optional(),
      script: string().optional().label(t`After Snapshot`),
      timeout: number().optional().label(t`Timeout - After`),
      mode: string().optional().label(t`Command Mode - After`)
    }).optional()
  }).optional(),
  osSnapshots: object({
    volumeShadowCopy: object({
      enable: number().optional()
    }).optional()
  }).optional(),
  logging: object({
    directories: object({
      snapshotted: number().optional(),
      ignored: number().optional()
    }).optional(),
    entries: object({
      snapshotted: number().optional(),
      ignored: number().optional(),
      cacheHit: number().optional(),
      cacheMiss: number().optional()
    }).optional()
  }).optional(),
  upload: object({
    maxParallelSnapshots: number().optional(),
    maxParallelFileReads: number().optional(),
    parallelUploadAboveSize: number().optional()
  }).optional(),
  noParent: boolean().optional()
});
