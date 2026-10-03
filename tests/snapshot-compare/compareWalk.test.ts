import { describe, expect, it } from "vitest";
import type { DirEntry, DirManifest } from "../../src/core/types";
import { walkTrees, type WalkProgress } from "../../src/snapshot-compare/compareWalk";

function file(name: string, obj: string, size: number): DirEntry {
  return { name, type: "f", mode: "0644", mtime: "2026-01-01T00:00:00Z", obj, size };
}

function dirEntry(name: string, obj: string): DirEntry {
  return {
    name,
    type: "d",
    mode: "0700",
    mtime: "2026-01-01T00:00:00Z",
    obj,
    summ: { size: 0, files: 0, symlinks: 0, dirs: 0, maxTime: "", numFailed: 0 }
  };
}

function manifest(entries: DirEntry[]): DirManifest {
  return { steam: "", entries, summary: { size: 0, files: 0, symlinks: 0, dirs: 0, maxTime: "", numFailed: 0 } };
}

describe("walkTrees", () => {
  it("fetches only differing folders, never identical subtrees", async () => {
    const fetched: string[] = [];
    const fetcher = async (oid: string) => {
      fetched.push(oid);
      if (oid === "dChanged") return manifest([file("inner-new", "i2", 5)]);
      if (oid === "dOld") return manifest([]);
      if (oid === "dSame") return manifest([file("inner", "i1", 1)]);
      throw new Error(`unexpected fetch ${oid}`);
    };
    const rootA = manifest([dirEntry("same", "dSame"), dirEntry("changed", "dOld")]);
    const rootB = manifest([dirEntry("same", "dSame"), dirEntry("changed", "dChanged")]);

    const { roots, stats } = await walkTrees(rootA, rootB, fetcher);

    // dSame was never fetched on either side
    expect(fetched.filter((o) => o === "dSame")).toHaveLength(0);
    expect(fetched.sort()).toEqual(["dChanged", "dOld"]);
    expect(stats.skippedDirs).toBe(1);
    expect(stats.filesAdded).toBe(1);
    expect(stats.delta).toBe(5);
    expect(roots.find((n) => n.name === "changed")?.agg?.filesAdded).toBe(1);
  });

  it("marks failed folders as errors and keeps the rest of the walk", async () => {
    const fetcher = async (oid: string) => {
      if (oid === "dBad") throw new Error("fetch failed");
      return manifest([]);
    };
    const rootA = manifest([dirEntry("bad", "dBad"), dirEntry("ok", "dOkA")]);
    const rootB = manifest([dirEntry("bad", "dBadB"), dirEntry("ok", "dOkB")]);

    const { roots, stats } = await walkTrees(rootA, rootB, fetcher);
    expect(stats.errors).toBe(1);
    expect(roots.find((n) => n.name === "bad")?.status).toBe("error");
    expect(roots.find((n) => n.name === "ok")?.fetched).toBe(true);
  });

  it("reports progress as folders are read", async () => {
    const events: WalkProgress[] = [];
    const fetcher = async () => manifest([]);
    const rootA = manifest([dirEntry("a", "a1"), dirEntry("b", "b1")]);
    const rootB = manifest([dirEntry("a", "a2"), dirEntry("b", "b2")]);

    await walkTrees(rootA, rootB, fetcher, { onProgress: (p) => events.push({ ...p }) });
    expect(events.length).toBeGreaterThan(0);
    const last = events[events.length - 1];
    expect(last.done).toBe(2);
    expect(last.pending).toBe(0);
    expect(last.errors).toBe(0);
  });

  it("rejects with AbortError when cancelled", async () => {
    const fetcher = async () => manifest([]);
    const rootA = manifest([dirEntry("a", "a1")]);
    const rootB = manifest([dirEntry("a", "a2")]);
    await expect(walkTrees(rootA, rootB, fetcher, { isCancelled: () => true })).rejects.toThrow("walk cancelled");
  });
});
