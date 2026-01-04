import { describe, expect, test } from "vitest";
import { onlyUnique } from "../../src/utils/onlyUnique";

describe("onlyUnique", () => {
  test("returns unique items", () => {
    const filtered = ["one", "one", "two"].filter(onlyUnique);
    expect(filtered).toStrictEqual(["one", "two"]);
  });
});
