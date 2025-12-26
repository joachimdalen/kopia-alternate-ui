import { describe, expect, test } from "vitest";
import TaskKindDisplay from "../../../tasks/components/TaskKindDisplay";
import { render } from "../../testing-utils";

describe("TaskKindDisplay", () => {
  test("renders Restore with correct info", async () => {
    const { findByText } = render(<TaskKindDisplay kind="Restore" />);

    const text = await findByText("Restore");

    expect(text).not.toBeUndefined();
  });
});
