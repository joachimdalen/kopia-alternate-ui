import { clientGet, clientPost } from "./clientApiFetch";
import type {
  ApiResponse,
  Snapshot,
  Snapshots,
  SourceInfo,
  Sources,
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

const methods = {
  getSnapshots,
  startSnapshot,
  getSnapshot,
  updateDescription,
};

export default methods;
