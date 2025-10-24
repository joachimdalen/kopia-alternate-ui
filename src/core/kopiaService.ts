import { clientGet, clientPost } from "./clientApiFetch";
import type {
  ApiResponse,
  DirManifest,
  RestoreRequest,
  Snapshot,
  Snapshots,
  SourceInfo,
  Sources,
  Status,
  TaskList,
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

function restore(data: RestoreRequest) {
  return clientPost("/api/v1/restore", data);
}
function getTasks(): Promise<ApiResponse<TaskList>> {
  return clientGet("/api/v1/tasks");
}
function getStatus(): Promise<ApiResponse<Status>> {
  return clientGet("/api/v1/repo/status");
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
};

export default methods;
