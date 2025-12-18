import { AppShell, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Outlet } from "react-router-dom";
import { Footer } from "./core/Footer/Footer";
import { Header } from "./core/Header/Header";
import { AppContextProvider } from "./core/context/AppContext";

function BaseLayout() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <AppContextProvider>
        <Notifications position="top-right" />
        <AppShell padding="md" header={{ height: 60 }} footer={{ height: 40 }}>
          <Header />
          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
          <Footer />
        </AppShell>
      </AppContextProvider>
    </MantineProvider>
  );
}

export default BaseLayout;
