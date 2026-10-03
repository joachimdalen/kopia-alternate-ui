import { describe, expect, it } from "vitest";
import { compactDiff, diffLines, looksLikeText } from "../../src/snapshot-compare/lineDiff";

const enc = new TextEncoder();

describe("diffLines", () => {
  it("returns all context lines for identical input", () => {
    const out = diffLines("a\nb\nc", "a\nb\nc");
    expect(out).toEqual([
      { type: "ctx", text: "a" },
      { type: "ctx", text: "b" },
      { type: "ctx", text: "c" }
    ]);
  });

  it("reports a modified line as del plus add, same position", () => {
    const out = diffLines("timeout: 30\nretries: 5", "timeout: 60\nretries: 5");
    expect(out).toEqual([
      { type: "del", text: "timeout: 30" },
      { type: "add", text: "timeout: 60" },
      { type: "ctx", text: "retries: 5" }
    ]);
  });

  it("reports pure additions and removals", () => {
    expect(diffLines("keep\n", "keep\nnew\n")).toEqual([
      { type: "ctx", text: "keep" },
      { type: "add", text: "new" },
      { type: "ctx", text: "" }
    ]);
    expect(diffLines("gone\nkeep", "keep")).toEqual([
      { type: "del", text: "gone" },
      { type: "ctx", text: "keep" }
    ]);
  });

  it("handles same-name file rewritten end to end", () => {
    const out = diffLines('{\n  "a": 1\n}', '{\n  "a": 2,\n  "b": 3\n}')!;
    expect(out.filter((l) => l.type === "add").map((l) => l.text)).toEqual(['  "a": 2,', '  "b": 3']);
    expect(out.filter((l) => l.type === "del").map((l) => l.text)).toEqual(['  "a": 1']);
  });

  it("returns null over the size cap instead of hanging", () => {
    const big = Array(5000).fill("x").join("\n");
    expect(diffLines(big, big + "\n", 1000)).toBeNull();
  });
});

describe("looksLikeText", () => {
  it("decodes utf-8 text", () => {
    expect(looksLikeText(enc.encode("héllo\nworld").buffer)).toBe("héllo\nworld");
  });
  it("rejects binary containing NUL bytes", () => {
    expect(looksLikeText(enc.encode("a\u0000b").buffer)).toBeNull();
  });
  it("rejects invalid utf-8", () => {
    expect(looksLikeText(new Uint8Array([0xff, 0xfe, 0xfd]).buffer)).toBeNull();
  });
});

describe("compactDiff", () => {
  it("collapses unchanged runs into ellipses with context around changes", () => {
    const lines = diffLines(
      Array.from({ length: 30 }, (_, i) => `l${i}`).join("\n"),
      Array.from({ length: 30 }, (_, i) => (i === 15 ? "CHANGED" : `l${i}`)).join("\n")
    )!;
    const out = compactDiff(lines, 2);
    expect(out.length).toBeLessThan(12);
    expect(out.some((l) => l.text === "…")).toBe(true);
    expect(out.some((l) => l.text === "CHANGED")).toBe(true);
  });
});
