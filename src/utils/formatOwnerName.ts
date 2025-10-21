import type { SourceInfo } from "../core/types";

export function formatOwnerName(sourceInfo: SourceInfo): string {
  return sourceInfo.userName + "@" + sourceInfo.host;
}
