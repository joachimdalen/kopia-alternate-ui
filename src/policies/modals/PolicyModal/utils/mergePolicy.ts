import merge from "lodash.merge";
import type { Policy } from "../../../../core/types";
import type { PolicyForm2 } from "../types";

export function mergePolicy(current: Policy): PolicyForm2 {
  return merge(
    {
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
    } satisfies PolicyForm2,
    current
  );
}
