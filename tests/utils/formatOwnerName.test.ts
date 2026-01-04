import { describe, expect, test } from "vitest";
import { formatOwnerName } from "../../src/utils/formatOwnerName";

describe("formatOwnerName", () => {
  test("formats from SourceInfo", () => {
    expect(
      formatOwnerName({
        host: "primary",
        userName: "my-user",
        path: "/just/here"
      })
    ).toBe("my-user@primary");
  });
});
