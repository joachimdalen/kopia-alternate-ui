import type { Policy } from "../../../../core/types";
import type { PolicyForm } from "../types";

export function transformPolicy(current: PolicyForm): Policy {
  return {
    retention: {
      keepLatest: current?.retention?.keepLatest,
      keepHourly: current?.retention?.keepHourly,
      keepDaily: current?.retention?.keepDaily,
      keepWeekly: current?.retention?.keepWeekly,
      keepMonthly: current?.retention?.keepMonthly,
      keepAnnual: current?.retention?.keepAnnual,
      ignoreIdenticalSnapshots: current?.retention?.ignoreIdenticalSnapshots
    },
    files: {
      ignore: current?.files?.ignore,
      noParentIgnore: current?.files?.noParentIgnore,
      ignoreDotFiles: current?.files?.ignoreDotFiles,
      noParentDotFiles: current?.files?.noParentDotFiles,
      ignoreCacheDirs: current?.files?.ignoreCacheDirs,
      maxFileSize: current?.files?.maxFileSize,
      oneFileSystem: current?.files?.oneFileSystem
    },
    errorHandling: {
      ignoreFileErrors: current?.errorHandling?.ignoreFileErrors,
      ignoreDirectoryErrors: current?.errorHandling?.ignoreDirectoryErrors,
      ignoreUnknownTypes: current?.errorHandling?.ignoreUnknownTypes
    },
    scheduling: {
      intervalSeconds: current?.scheduling?.intervalSeconds,
      timeOfDay: current?.scheduling?.timeOfDay,
      noParentTimeOfDay: current?.scheduling?.noParentTimeOfDay,
      manual: current?.scheduling?.manual,
      cron: current?.scheduling?.cron,
      runMissed: current?.scheduling?.runMissed
    },
    compression: {
      compressorName: current?.compression?.compressorName,
      onlyCompress: current?.compression?.onlyCompress,
      noParentOnlyCompress: current?.compression?.noParentOnlyCompress,
      neverCompress: current?.compression?.neverCompress,
      noParentNeverCompress: current?.compression?.noParentNeverCompress,
      minSize: current?.compression?.minSize,
      maxSize: current?.compression?.maxSize
    },
    metadataCompression: {
      compressorName: current?.metadataCompression?.compressorName
    },
    splitter: {
      algorithm: current?.splitter?.algorithm
    },
    actions: {
      beforeFolder: {
        args: current?.actions?.beforeFolder?.args,
        mode: current?.actions?.beforeFolder?.mode,
        path: current?.actions?.beforeFolder?.path,
        script: current?.actions?.beforeFolder?.script,
        timeout: current?.actions?.beforeFolder?.timeout
      },
      afterFolder: {
        args: current?.actions?.afterFolder?.args,
        mode: current?.actions?.afterFolder?.mode,
        path: current?.actions?.afterFolder?.path,
        script: current?.actions?.afterFolder?.script,
        timeout: current?.actions?.afterFolder?.timeout
      },
      beforeSnapshotRoot: {
        args: current?.actions?.beforeSnapshotRoot?.args,
        mode: current?.actions?.beforeSnapshotRoot?.mode,
        path: current?.actions?.beforeSnapshotRoot?.path,
        script: current?.actions?.beforeSnapshotRoot?.script,
        timeout: current?.actions?.beforeSnapshotRoot?.timeout
      },
      afterSnapshotRoot: {
        args: current?.actions?.afterSnapshotRoot?.args,
        mode: current?.actions?.afterSnapshotRoot?.mode,
        path: current?.actions?.afterSnapshotRoot?.path,
        script: current?.actions?.afterSnapshotRoot?.script,
        timeout: current?.actions?.afterSnapshotRoot?.timeout
      }
    },
    osSnapshots: {
      volumeShadowCopy: {
        enable: current?.osSnapshots?.volumeShadowCopy?.enable
      }
    },
    logging: {
      directories: {
        ignored: current?.logging?.directories?.ignored,
        snapshotted: current?.logging?.directories?.snapshotted
      },
      entries: {
        cacheHit: current?.logging?.entries?.cacheHit,
        cacheMiss: current?.logging?.entries?.cacheMiss
      }
    },
    upload: {
      maxParallelFileReads: current?.upload?.maxParallelFileReads,
      maxParallelSnapshots: current?.upload?.maxParallelSnapshots,
      parallelUploadAboveSize: current?.upload?.parallelUploadAboveSize
    },
    noParent: current?.noParent
  } satisfies Policy;
}
