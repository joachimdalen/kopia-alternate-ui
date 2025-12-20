import { AppShell } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { SkeletonHeader } from "./Header/SkeletonHeader";

function SkeletonLayout({ children }: PropsWithChildren) {
  return (
    <AppShell padding="md" header={{ height: 60 }} footer={{ height: 40 }}>
      <SkeletonHeader />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default SkeletonLayout;
