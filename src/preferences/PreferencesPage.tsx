import {
  Container,
  Divider,
  Paper,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@mantine/core";
import { IconNotification, IconPalette } from "@tabler/icons-react";
import IconWrapper from "../core/IconWrapper";
import RepoTitle from "../core/RepoTitle/RepoTitle";
import AppearanceSection from "./AppearanceSection";
import NotificationsSection from "./NotificationsSection";

function PreferencesPage() {
  return (
    <Container fluid>
      <Stack w="100%">
        <RepoTitle />
        <Divider />
        <Paper withBorder>
          <Tabs defaultValue="appearance">
            <TabsList>
              <TabsTab
                value="appearance"
                leftSection={
                  <IconWrapper icon={IconPalette} size={18} color="blue" />
                }
              >
                Appearance
              </TabsTab>
              <TabsTab
                value="notifications"
                leftSection={
                  <IconWrapper
                    icon={IconNotification}
                    size={18}
                    color="grape"
                  />
                }
              >
                Notifications
              </TabsTab>
            </TabsList>
            <TabsPanel value="appearance" p="md">
              <AppearanceSection />
            </TabsPanel>
            <TabsPanel value="notifications">
              <NotificationsSection />
            </TabsPanel>
          </Tabs>
        </Paper>
      </Stack>
    </Container>
  );
}

export default PreferencesPage;
