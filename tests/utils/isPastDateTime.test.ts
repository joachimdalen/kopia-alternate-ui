import dayjs from "dayjs";
import { describe, expect, test } from "vitest";
import { isPastDateTime } from "../../src/utils/isPasteDateTime";

describe("isPastDateTime", () => {
  test("returns correct", () => {
    const past = dayjs("2018-04-04T16:00:00.000Z");
    expect(isPastDateTime(past.toISOString(), "en")).toBeTruthy();
  });
});
