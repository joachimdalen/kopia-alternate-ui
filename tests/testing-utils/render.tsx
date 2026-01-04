// ./test-utils/render.tsx

import { MantineProvider } from "@mantine/core";
import { render as testingLibraryRender } from "@testing-library/react";

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => <MantineProvider env="test">{children}</MantineProvider>
  });
}
