import { describe, expect, test } from "vitest";
import sizeDisplayName from "../../src/utils/formatSize";

describe("sizeDisplayName", () => {
  test("formats sizes in base 10", () => {
    expect(sizeDisplayName(0, false)).toBe("0 B");
    expect(sizeDisplayName(200, false)).toBe("200 B");
    expect(sizeDisplayName(1000, false)).toBe("1 KB");
    expect(sizeDisplayName(1200, false)).toBe("1.2 KB");
    expect(sizeDisplayName(1000000, false)).toBe("1 MB");
    expect(sizeDisplayName(1200000000, false)).toBe("1.2 GB");
  });
  test("formats sizes in base 2", () => {
    expect(sizeDisplayName(0, true)).toBe("0 B");
    expect(sizeDisplayName(512, true)).toBe("512 B");
    expect(sizeDisplayName(1024, true)).toBe("1 KiB");
    expect(sizeDisplayName(1536, true)).toBe("1.5 KiB");
    expect(sizeDisplayName(1048576, true)).toBe("1 MiB");
    expect(sizeDisplayName(1610612736, true)).toBe("1.5 GiB");
  });
});
