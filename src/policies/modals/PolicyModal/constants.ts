import type { PolicyForm2 } from "./types";

export const defaultForm: PolicyForm2 = {
  retention: {
    keepLatest: -1,
    keepHourly: -1,
    keepDaily: -1,
    keepWeekly: -1,
    keepMonthly: -1,
    keepAnnual: -1,
    ignoreIdenticalSnapshots: undefined
  },
  files: {
    ignore: [],
    noParentIgnore: undefined,
    ignoreDotFiles: [],
    noParentDotFiles: undefined,
    ignoreCacheDirs: undefined,
    maxFileSize: -1,
    oneFileSystem: undefined
  },
  errorHandling: {
    ignoreFileErrors: undefined,
    ignoreDirectoryErrors: undefined,
    ignoreUnknownTypes: undefined
  },
  scheduling: {
    intervalSeconds: -1,
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
    minSize: -1,
    maxSize: -1
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
      timeout: -1
    },
    afterFolder: {
      args: [],
      mode: "",
      path: "",
      script: "",
      timeout: -1
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
      timeout: -1
    }
  },
  osSnapshots: {
    volumeShadowCopy: {
      enable: -1
    }
  },
  logging: {
    directories: {
      ignored: -1,
      snapshotted: -1
    },
    entries: {
      cacheHit: -1,
      cacheMiss: -1
    }
  },
  upload: {
    maxParallelFileReads: -1,
    maxParallelSnapshots: -1,
    parallelUploadAboveSize: -1
  },
  noParent: undefined
};
