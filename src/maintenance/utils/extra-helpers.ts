import type { RunInfo } from "../../core/types";

export function getExtraData(runInfo: RunInfo, index: number, name: string) {
  if (runInfo.extra === undefined) return undefined;
  if (runInfo.extra.length < index) return undefined;
  const info = runInfo.extra[index]?.data;
  if (info === undefined || info === null) return undefined;
  return info[name];
}
export function getExtraKind(runInfo: RunInfo, index: number) {
  if (runInfo.extra === undefined) return undefined;
  if (runInfo.extra.length < index) return undefined;
  const info = runInfo.extra[index]?.kind;
  if (info === undefined || info === null) return undefined;
  return info;
}
