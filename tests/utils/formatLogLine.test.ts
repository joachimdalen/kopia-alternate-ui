import { describe, expect, test } from "vitest";
import { formatLogLine } from "../../src/utils/formatLogLine";

describe("formatLogLine", () => {
  test("returns message without parts", () => {
    const formatted = formatLogLine({
      ts: 1767507503.9307563,
      level: 0,
      mod: "maintenance",
      msg: "Cleaning up unneeded epoch markers..."
    });
    expect(formatted).toStrictEqual(
      "\x1b[34m07:18:23:930\x1b[0m : Cleaning up unneeded epoch markers... \x1b[35m \x1b[0m"
    );
  });
  test("removes trailing newline", () => {
    const formatted = formatLogLine({
      ts: 1767507503.9307563,
      level: 0,
      mod: "maintenance",
      msg: "Cleaning up unneeded epoch markers...\n"
    });
    expect(formatted).toStrictEqual(
      "\x1b[34m07:18:23:930\x1b[0m : Cleaning up unneeded epoch markers... \x1b[35m \x1b[0m"
    );
  });
  test("adds parts", () => {
    const formatted = formatLogLine({
      ts: 1767507503.9307563,
      level: 0,
      mod: "maintenance",
      msg: "Cleaning up unneeded epoch markers...",
      dummy: "hello"
    });
    expect(formatted).toStrictEqual(
      `\x1b[34m07:18:23:930\x1b[0m : Cleaning up unneeded epoch markers... \x1b[35m {"dummy":"hello"}\x1b[0m`
    );
  });
});
