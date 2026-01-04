import { formatTimestamp } from "../core/formatTimestamp";
import type { LogEntry } from "../core/types";

export function formatLogLine(entry: LogEntry): string {
  const { level, ts, msg, mod, ...rest } = entry;
  const parts = JSON.stringify(rest);
  const timespan = formatTimestamp(new Date(ts * 1000));
  const message = msg.trimEnd();
  const partText = parts === "{}" ? "" : parts;
  return `\x1b[34m ${timespan}\x1b[0m : ${message} \x1b[35m ${partText}\x1b[0m`;
}
