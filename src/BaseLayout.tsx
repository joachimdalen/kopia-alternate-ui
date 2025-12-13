import { AppShell, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Outlet } from "react-router-dom";
import { Footer } from "./core/Footer/Footer";
import { Header } from "./core/Header/Header";

function BaseLayout() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Notifications />
      <AppShell padding="md" header={{ height: 60 }} footer={{ height: 40 }}>
        <Header />
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
        <Footer />
      </AppShell>
    </MantineProvider>
  );
}

export default BaseLayout;
