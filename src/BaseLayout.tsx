import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "./core/Footer/Footer";
import { Header } from "./core/Header/Header";
import { AppContextProvider } from "./core/context/AppContext";
import { ServerInstanceContextProvider } from "./core/context/ServerInstanceContext";
import { dynamicActivate } from "./i18n";

function BaseLayout() {
  const theme = createTheme({
    fontFamily: '"Nunito", sans-serif;',
  });

  useEffect(() => {
    dynamicActivate();
  }, []);

  return (
    <I18nProvider i18n={i18n}>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <ModalsProvider>
          <ServerInstanceContextProvider>
            <AppContextProvider>
              <Notifications position="top-right" />
              <AppShell
                padding="md"
                header={{ height: 60 }}
                footer={{ height: 40 }}
              >
                <Header />
                <AppShell.Main>
                  <Outlet />
                </AppShell.Main>
                <Footer />
              </AppShell>
            </AppContextProvider>
          </ServerInstanceContextProvider>
        </ModalsProvider>
      </MantineProvider>
    </I18nProvider>
  );
}

export default BaseLayout;
