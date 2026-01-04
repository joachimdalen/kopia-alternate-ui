import merge from "lodash.merge";
import type { Policy } from "../../../../core/types";
import type { PolicyForm } from "../types";

export function mergePolicy(current: Policy): PolicyForm {
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
    } satisfies PolicyForm,
    current
  );
}
