import { AppShell } from "@mantine/core";
import { SkeletonHeader } from "./Header/SkeletonHeader";

function SkeletonLayout({ children }) {
  return (
    <AppShell padding="md" header={{ height: 60 }} footer={{ height: 40 }}>
      <SkeletonHeader />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default SkeletonLayout;
