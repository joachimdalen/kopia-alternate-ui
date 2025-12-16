import {
  clientDelete,
  clientGet,
  clientPost,
  clientPut,
} from "./clientApiFetch";
import type {
  AlgorithmsList,
  ApiResponse,
  DirManifest,
  NotificationProfile,
  PoliciesList,
  Policy,
  Preferences,
  ResolvedPolicy,
  ResolvePolicyRequest,
  RestoreRequest,
  Snapshot,
  Snapshots,
  SourceInfo,
  Sources,
  Status,
  Task,
  TaskList,
  TasksSummary,
} from "./types";
function getSnapshots(): Promise<ApiResponse<Sources>> {
  return clientGet("/api/v1/sources");
}

function startSnapshot(sourceInfo: SourceInfo) {
  return clientPost("/api/v1/sources/upload", undefined, sourceInfo);
}
function getSnapshot(query: {
  [key: string]: string;
}): Promise<ApiResponse<Snapshots>> {
  return clientGet("/api/v1/snapshots", query);
}
function updateDescription(
  snapshotIds: string[],
  description: string
): Promise<ApiResponse<Snapshot[]>> {
  return clientPost("/api/v1/snapshots/edit", {
    description,
    snapshots: snapshotIds,
  });
}
function addPin(
  snapshotId: string,
  pin: string
): Promise<ApiResponse<Snapshot[]>> {
  return clientPost("/api/v1/snapshots/edit", {
    addPins: [pin],
    removePins: [],
    snapshots: [snapshotId],
  });
}
function updatePin(
  snapshotId: string,
  currentPin: string,
  pin: string
): Promise<ApiResponse<Snapshot[]>> {
  return clientPost("/api/v1/snapshots/edit", {
    addPins: [pin],
    removePins: [currentPin],
    snapshots: [snapshotId],
  });
}
function removePin(
  snapshotId: string,
  pin: string
): Promise<ApiResponse<Snapshot[]>> {
  return clientPost("/api/v1/snapshots/edit", {
    removePins: [pin],
    snapshots: [snapshotId],
  });
}
function getObjects(oid: string): Promise<ApiResponse<DirManifest>> {
  return clientGet(`/api/v1/objects/${oid}`);
}

function restore(data: RestoreRequest): Promise<ApiResponse<Task>> {
  return clientPost("/api/v1/restore", data);
}
function getTasks(): Promise<ApiResponse<TaskList>> {
  return clientGet("/api/v1/tasks");
}
function getTask(taskId: string): Promise<ApiResponse<Task>> {
  return clientGet(`/api/v1/tasks/${taskId}`);
}
function getTaskLogs(taskId: string): Promise<
  ApiResponse<{
    logs: {
      level: number;
      ts: number;
      msg: string;
      mod: string;
    }[];
  }>
> {
  return clientGet(`/api/v1/tasks/${taskId}/logs`);
}
function getStatus(): Promise<ApiResponse<Status>> {
  return clientGet("/api/v1/repo/status");
}
function getPolicies(): Promise<ApiResponse<PoliciesList>> {
  return clientGet("/api/v1/policies");
}

function getAlgorithms(): Promise<ApiResponse<AlgorithmsList>> {
  return clientGet("/api/v1/repo/algorithms");
}
function getPolicy(source: SourceInfo): Promise<ApiResponse<Policy>> {
  return clientGet("/api/v1/policy", source);
}
function savePolicy(
  policy: Policy,
  source: SourceInfo
): Promise<ApiResponse<Policy>> {
  return clientPut("/api/v1/policy", policy, source);
}
function getTasksSummary(): Promise<ApiResponse<TasksSummary>> {
  return clientGet("/api/v1/tasks-summary");
}
function resolvePolicy(
  source: SourceInfo,
  data: ResolvePolicyRequest
): Promise<ApiResponse<ResolvedPolicy>> {
  return clientPost("/api/v1/policy/resolve", data, source);
}
function getPreferences(): Promise<ApiResponse<Preferences>> {
  return clientGet("/api/v1/ui-preferences");
}
function setPreferences(data: Preferences): Promise<ApiResponse<Preferences>> {
  return clientPut("/api/v1/ui-preferences", data);
}

function getNotificationProfiles(): Promise<
  ApiResponse<NotificationProfile[]>
> {
  return clientGet("/api/v1/notificationProfiles");
}
function createNotificationProfile(
  profile: NotificationProfile
): Promise<ApiResponse<NotificationProfile>> {
  return clientPost("/api/v1/notificationProfiles", profile);
}
function deleteNotificationProfile(
  profileName: string
): Promise<ApiResponse<unknown>> {
  return clientDelete(`/api/v1/notificationProfiles/${profileName}`);
}
function testNotificationProfile(
  profile: NotificationProfile
): Promise<ApiResponse<unknown>> {
  return clientPost(`/api/v1/testNotificationProfile`, profile);
}
const methods = {
  getSnapshots,
  startSnapshot,
  getSnapshot,
  updateDescription,
  getObjects,
  addPin,
  updatePin,
  removePin,
  restore,
  getTasks,
  getStatus,
  getPolicies,
  getAlgorithms,
  getPolicy,
  resolvePolicy,
  getTasksSummary,
  getTask,
  getTaskLogs,
  getPreferences,
  setPreferences,
  getNotificationProfiles,
  createNotificationProfile,
  deleteNotificationProfile,
  testNotificationProfile,
  savePolicy,
};

export default methods;
