import { AppShell, AppShellFooter, MantineProvider, Text } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Header } from "./core/Header/Header";

function BaseLayout() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <AppShell padding="md" header={{ height: 60 }}>
        <Header />

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
        <AppShellFooter p="xs">
          <Text fz="xs">
            Version v0.21.1 0733cb4d2a731dbb92d927f66230694e014f4df2
            kopia/htmlui f951773b9eeb5015c79bedacf49dee15f758bbcb built on Sat
            Jun 7 18:14:52 UTC 2025 fv-az1788-890
          </Text>
        </AppShellFooter>
      </AppShell>
    </MantineProvider>
  );
}

export default BaseLayout;
