import { describe, expect, it } from "vitest";
import type { DirEntry, DirManifest } from "../../src/core/types";
import {
  aggregate,
  compareEntries,
  emptyStats,
  finalizeAggregates,
  type DiffNode
} from "../../src/snapshot-compare/diffTree";

function file(name: string, obj: string, size: number, extra?: Partial<DirEntry>): DirEntry {
  return { name, type: "f", mode: "0644", mtime: "2026-01-01T00:00:00Z", obj, size, ...extra };
}

function dir(name: string, obj: string, summ?: { size: number; files: number; dirs?: number }): DirEntry {
  return {
    name,
    type: "d",
    mode: "0700",
    mtime: "2026-01-01T00:00:00Z",
    obj,
    summ: summ
      ? { size: summ.size, files: summ.files, dirs: summ.dirs ?? 0, symlinks: 0, maxTime: "", numFailed: 0 }
      : undefined
  };
}

function manifest(entries: DirEntry[]): DirManifest {
  return { steam: "", entries, summary: { size: 0, files: 0, symlinks: 0, dirs: 0, maxTime: "", numFailed: 0 } };
}

function walk(listA: DirEntry[], listB: DirEntry[]) {
  const stats = emptyStats();
  const nodes = compareEntries(listA, listB, "", stats);
  return { nodes, stats };
}

describe("compareEntries", () => {
  it("drops entries with identical object IDs and counts nothing", () => {
    const a = [file("same.txt", "o1", 10), dir("sub", "d1", { size: 100, files: 5 })];
    const { nodes, stats } = walk(a, [...a]);
    expect(nodes).toHaveLength(0);
    expect(stats.skippedDirs).toBe(1);
    expect(stats.skippedFiles).toBe(5);
    expect(stats.delta).toBe(0);
  });

  it("counts metadata-only changes as modified with zero delta", () => {
    const { nodes, stats } = walk([file("f", "o1", 10, { mode: "0644" })], [file("f", "o1", 10, { mode: "0600" })]);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].status).toBe("modified");
    expect(nodes[0].metaChanges).toEqual([{ field: "mode", from: "0644", to: "0600" }]);
    expect(stats.filesModified).toBe(1);
    expect(stats.delta).toBe(0);
  });

  it("counts added and removed files with signed deltas", () => {
    const { nodes, stats } = walk(
      [file("kept", "o1", 10), file("gone", "o2", 30)],
      [file("kept", "o1", 10), file("new", "o3", 20)]
    );
    expect(nodes.map((n) => n.status).sort()).toEqual(["added", "removed"]);
    expect(stats.filesAdded).toBe(1);
    expect(stats.filesRemoved).toBe(1);
    expect(stats.bytesAdded).toBe(20);
    expect(stats.bytesRemoved).toBe(30);
    expect(stats.delta).toBe(-10);
  });

  it("uses directory summaries for one-sided directories without fetching", () => {
    const { nodes, stats } = walk([], [dir("backup", "d9", { size: 500, files: 7, dirs: 2 })]);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].status).toBe("added");
    expect(nodes[0].oneSided).toEqual({ files: 7, dirs: 2, size: 500 });
    expect(nodes[0].children).toBeUndefined();
    expect(stats.dirsAdded).toBe(1);
    expect(stats.bytesAdded).toBe(500);
    expect(stats.delta).toBe(500);
  });

  it("reports modified files with the size delta", () => {
    const { nodes, stats } = walk([file("log", "o1", 100)], [file("log", "o2", 150)]);
    expect(nodes[0].status).toBe("modified");
    expect(nodes[0].delta).toBe(50);
    expect(stats.filesModified).toBe(1);
    expect(stats.modifiedDelta).toBe(50);
    expect(stats.delta).toBe(50);
  });

  it("flags type changes between file and directory", () => {
    const { nodes } = walk([file("x", "o1", 5)], [dir("x", "d1", { size: 5, files: 1 })]);
    expect(nodes[0].status).toBe("modified");
    expect(nodes[0].typeChanged).toBe(true);
  });

  it("returns differing directories unfetched for the walker to load", () => {
    const { nodes, stats } = walk(
      [dir("sub", "d1", { size: 10, files: 1 })],
      [dir("sub", "d2", { size: 12, files: 2 })]
    );
    expect(nodes).toHaveLength(1);
    expect(nodes[0].fetched).toBe(false);
    expect(nodes[0].children).toBeUndefined();
    // one-sided counting must not fire for two-sided dirs
    expect(stats.dirsAdded).toBe(0);
    expect(stats.delta).toBe(0);
  });
});

describe("aggregates", () => {
  it("keeps error nodes in their own slot instead of counting them as modified", () => {
    const children: DiffNode[] = [
      { id: "e", name: "e", path: "e", status: "error", isDir: true, typeChanged: false, delta: 0, fetched: true },
      { id: "m", name: "m", path: "m", status: "modified", isDir: false, typeChanged: false, delta: 5, fetched: true }
    ];
    const agg = aggregate(children);
    expect(agg.errors).toBe(1);
    expect(agg.filesModified).toBe(1);
    expect(agg.delta).toBe(5);
  });

  it("rolls aggregates up recursively", () => {
    const { nodes } = walk(
      [dir("root-ish", "d1", { size: 10, files: 1 })],
      [dir("root-ish", "d2", { size: 12, files: 2 })]
    );
    const root = nodes[0];
    root.children = compareEntries([file("gone", "x1", 10)], [file("new", "x2", 25)], "root-ish", emptyStats());
    root.fetched = true;
    const agg = finalizeAggregates([root]);
    expect(root.agg?.filesAdded).toBe(1);
    expect(root.agg?.filesRemoved).toBe(1);
    expect(root.agg?.delta).toBe(15);
    expect(agg.delta).toBe(15);
  });
});

describe("manifest fixture sanity", () => {
  it("builds a manifest", () => {
    const m = manifest([file("f", "o", 1)]);
    expect(m.entries).toHaveLength(1);
  });
});
