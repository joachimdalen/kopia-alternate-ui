import type { DirManifest } from "../core/types";
import { compareEntries, emptyStats, finalizeAggregates, type DiffNode, type DiffStats } from "./diffTree";

export type WalkProgress = {
  /** Differing folders whose entries have been read so far. */
  done: number;
  /** Differing folders known but not yet read. */
  pending: number;
  /** Folders whose object fetch failed. */
  errors: number;
};

export type WalkResult = {
  roots: DiffNode[];
  stats: DiffStats;
};

export type WalkOptions = {
  concurrency?: number;
  onProgress?: (progress: WalkProgress) => void;
  isCancelled?: () => boolean;
};

type Fetcher = (oid: string) => Promise<DirManifest>;

/**
 * Walks two snapshot trees, fetching only the directories whose object IDs
 * differ (equal IDs are settled by compareEntries without fetching). Uses a
 * bounded worker pool; a failed fetch marks the folder as an error node and
 * the walk continues, so the result is partial-but-honest rather than
 * truncated.
 */
export async function walkTrees(
  rootA: DirManifest,
  rootB: DirManifest,
  fetchManifest: Fetcher,
  options: WalkOptions = {}
): Promise<WalkResult> {
  const concurrency = options.concurrency ?? 6;
  const stats = emptyStats();
  const roots = compareEntries(rootA.entries, rootB.entries, "", stats);

  const queue: DiffNode[] = roots.filter((n) => n.isDir && !n.fetched && n.status === "modified");
  let done = 0;
  let errors = 0;
  const cancelled = () => options.isCancelled?.() ?? false;

  const report = () => options.onProgress?.({ done, pending: queue.length + inFlight, errors });

  let inFlight = 0;

  const worker = async () => {
    for (;;) {
      if (cancelled()) return;
      const node = queue.shift();
      if (node === undefined) return;
      inFlight++;
      report();
      try {
        const [manifestA, manifestB] = await Promise.all([fetchManifest(node.a!.obj), fetchManifest(node.b!.obj)]);
        if (cancelled()) return;
        node.children = compareEntries(manifestA.entries, manifestB.entries, node.path, stats);
        for (const child of node.children) {
          if (child.isDir && !child.fetched && child.status === "modified") {
            queue.push(child);
          }
        }
        node.fetched = true;
      } catch {
        node.status = "error";
        node.fetched = true;
        errors++;
        stats.errors++;
      }
      done++;
      inFlight--;
      report();
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, Math.max(queue.length, 1)) }, () => worker());
  await Promise.all(workers);

  if (cancelled()) throw new DOMException("walk cancelled", "AbortError");
  finalizeAggregates(roots);
  return { roots, stats };
}
