import type { DirEntry } from "../core/types";

export type DiffStatus = "added" | "removed" | "modified" | "error";

export type MetaChange = {
  field: "mode" | "mtime";
  from: string;
  to: string;
};

export type DiffAggregate = {
  filesAdded: number;
  filesRemoved: number;
  filesModified: number;
  dirsAdded: number;
  dirsRemoved: number;
  errors: number;
  bytesAdded: number;
  bytesRemoved: number;
  modifiedDelta: number;
  delta: number;
};

export type DiffNode = {
  id: string;
  name: string;
  path: string;
  status: DiffStatus;
  isDir: boolean;
  typeChanged: boolean;
  a?: DirEntry;
  b?: DirEntry;
  /** Signed size delta for files and one-sided directories. */
  delta: number;
  /** Present on directories that were compared on both sides. */
  agg?: DiffAggregate;
  /** Present on one-sided directories; contents are not fetched. */
  oneSided?: {
    files: number;
    dirs: number;
    size: number;
  };
  /** Differing directory whose children the walker has not fetched yet. */
  fetched: boolean;
  children?: DiffNode[];
  metaChanges?: MetaChange[];
};

export type DiffStats = DiffAggregate & {
  skippedDirs: number;
  skippedFiles: number;
};

export function emptyStats(): DiffStats {
  return {
    filesAdded: 0,
    filesRemoved: 0,
    filesModified: 0,
    dirsAdded: 0,
    dirsRemoved: 0,
    errors: 0,
    bytesAdded: 0,
    bytesRemoved: 0,
    modifiedDelta: 0,
    delta: 0,
    skippedDirs: 0,
    skippedFiles: 0
  };
}

/** Kopia serializes entry types as single letters: d/f/s. */
export function isDirectoryEntry(entry: DirEntry): boolean {
  return entry.type === "d";
}

export function entrySize(entry: DirEntry): number {
  if (isDirectoryEntry(entry)) return entry.summ?.size ?? 0;
  return entry.size ?? 0;
}

export function entryFiles(entry: DirEntry): number {
  if (isDirectoryEntry(entry)) return entry.summ?.files ?? 0;
  return 1;
}

function metaDiffs(a: DirEntry, b: DirEntry): MetaChange[] {
  const changes: MetaChange[] = [];
  if (a.mode !== b.mode) changes.push({ field: "mode", from: a.mode, to: b.mode });
  if (a.mtime !== b.mtime) changes.push({ field: "mtime", from: a.mtime, to: b.mtime });
  return changes;
}

function oneSidedDir(entry: DirEntry, status: "added" | "removed", path: string, id: string): DiffNode {
  const size = entrySize(entry);
  const files = entryFiles(entry);
  const dirs = entry.summ?.dirs ?? 0;
  return {
    id,
    name: entry.name,
    path,
    status,
    isDir: true,
    typeChanged: false,
    a: status === "removed" ? entry : undefined,
    b: status === "added" ? entry : undefined,
    delta: status === "added" ? size : -size,
    oneSided: { files, dirs, size },
    fetched: true
  };
}

export function aggregate(children: DiffNode[]): DiffAggregate {
  const agg: DiffAggregate = {
    filesAdded: 0,
    filesRemoved: 0,
    filesModified: 0,
    dirsAdded: 0,
    dirsRemoved: 0,
    errors: 0,
    bytesAdded: 0,
    bytesRemoved: 0,
    modifiedDelta: 0,
    delta: 0
  };
  for (const child of children) {
    if (child.status === "error") {
      agg.errors += 1;
      continue;
    }
    if (child.isDir && child.agg) {
      agg.filesAdded += child.agg.filesAdded;
      agg.filesRemoved += child.agg.filesRemoved;
      agg.filesModified += child.agg.filesModified;
      agg.dirsAdded += child.agg.dirsAdded;
      agg.dirsRemoved += child.agg.dirsRemoved;
      agg.errors += child.agg.errors;
      agg.bytesAdded += child.agg.bytesAdded;
      agg.bytesRemoved += child.agg.bytesRemoved;
      agg.modifiedDelta += child.agg.modifiedDelta;
      agg.delta += child.agg.delta;
      continue;
    }
    switch (child.status) {
      case "added":
        if (child.isDir) {
          agg.dirsAdded += 1;
        } else {
          agg.filesAdded += 1;
        }
        agg.bytesAdded += child.delta;
        agg.delta += child.delta;
        break;
      case "removed":
        if (child.isDir) {
          agg.dirsRemoved += 1;
        } else {
          agg.filesRemoved += 1;
        }
        agg.bytesRemoved += -child.delta;
        agg.delta += child.delta;
        break;
      case "modified":
        agg.filesModified += 1;
        agg.modifiedDelta += child.delta;
        agg.delta += child.delta;
        break;
    }
  }
  return agg;
}

/**
 * Compares the entry lists of two directory versions. Kopia is
 * content-addressed: entries with equal object IDs are identical, so equal
 * subtrees are counted as skipped and never produce nodes. Differing
 * directories are returned unfetched (fetched: false) — the walker decides
 * when to load their children.
 */
export function compareEntries(
  listA: DirEntry[] | undefined,
  listB: DirEntry[] | undefined,
  parentPath: string,
  stats: DiffStats
): DiffNode[] {
  const byNameA = new Map((listA ?? []).map((e) => [e.name, e]));
  const byNameB = new Map((listB ?? []).map((e) => [e.name, e]));
  const names = new Set([...byNameA.keys(), ...byNameB.keys()]);

  const nodes: DiffNode[] = [];
  let i = 0;
  for (const name of [...names].sort()) {
    const id = `n${i++}`;
    const a = byNameA.get(name);
    const b = byNameB.get(name);
    const path = parentPath ? `${parentPath}/${name}` : name;

    if (a && b && a.obj === b.obj) {
      // Identical content. Directories with equal object IDs are identical
      // subtrees; only metadata could have changed (and for dirs we treat
      // that as identical too — the entry carries no dir metadata worth
      // surfacing).
      if (isDirectoryEntry(a)) {
        stats.skippedDirs += 1;
        stats.skippedFiles += entryFiles(a);
      } else {
        const changes = metaDiffs(a, b);
        if (changes.length > 0) {
          stats.filesModified += 1;
          nodes.push({
            id,
            name,
            path,
            status: "modified",
            isDir: false,
            typeChanged: false,
            a,
            b,
            delta: 0,
            fetched: true,
            metaChanges: changes
          });
        }
      }
      continue;
    }

    if (a && b) {
      const bothDirs = isDirectoryEntry(a) && isDirectoryEntry(b);
      if (bothDirs) {
        nodes.push({
          id,
          name,
          path,
          status: "modified",
          isDir: true,
          typeChanged: false,
          a,
          b,
          delta: 0,
          fetched: false
        });
        continue;
      }
      const delta = entrySize(b) - entrySize(a);
      stats.filesModified += 1;
      stats.modifiedDelta += delta;
      stats.delta += delta;
      nodes.push({
        id,
        name,
        path,
        status: "modified",
        isDir: false,
        typeChanged: a.type !== b.type,
        a,
        b,
        delta,
        fetched: true
      });
      continue;
    }

    if (b) {
      if (isDirectoryEntry(b)) {
        stats.dirsAdded += 1;
        stats.bytesAdded += entrySize(b);
        stats.delta += entrySize(b);
        nodes.push(oneSidedDir(b, "added", path, id));
      } else {
        stats.filesAdded += 1;
        stats.bytesAdded += b.size ?? 0;
        stats.delta += b.size ?? 0;
        nodes.push({
          id,
          name,
          path,
          status: "added",
          isDir: false,
          typeChanged: false,
          b,
          delta: b.size ?? 0,
          fetched: true
        });
      }
      continue;
    }

    if (a) {
      if (isDirectoryEntry(a)) {
        stats.dirsRemoved += 1;
        stats.bytesRemoved += entrySize(a);
        stats.delta -= entrySize(a);
        nodes.push(oneSidedDir(a, "removed", path, id));
      } else {
        stats.filesRemoved += 1;
        stats.bytesRemoved += a.size ?? 0;
        stats.delta -= a.size ?? 0;
        nodes.push({
          id,
          name,
          path,
          status: "removed",
          isDir: false,
          typeChanged: false,
          a,
          delta: -(a.size ?? 0),
          fetched: true
        });
      }
    }
  }
  return nodes;
}

/** Fills in directory aggregates bottom-up once the walk has finished. */
export function finalizeAggregates(nodes: DiffNode[]): DiffAggregate {
  const roll = (node: DiffNode) => {
    if (node.isDir && node.children) {
      for (const child of node.children) roll(child);
      node.agg = aggregate(node.children);
    }
  };
  for (const node of nodes) roll(node);
  return aggregate(nodes);
}
