import { Trans } from "@lingui/react/macro";
import { Container, Divider, Paper, Stack, Tabs, TabsList, TabsPanel, TabsTab, Title } from "@mantine/core";
import { IconNotification, IconPalette } from "@tabler/icons-react";
import IconWrapper from "../core/IconWrapper";
import AppearanceSection from "./AppearanceSection";
import NotificationsSection from "./NotificationsSection";

function PreferencesPage() {
  return (
    <Container>
      <Stack w="100%">
        <Title order={1}>
          <Trans>Preferences</Trans>
        </Title>
        <Divider />
        <Paper withBorder>
          <Tabs defaultValue="appearance">
            <TabsList>
              <TabsTab value="appearance" leftSection={<IconWrapper icon={IconPalette} size={18} color="blue" />}>
                <Trans>Appearance</Trans>
              </TabsTab>
              <TabsTab
                value="notifications"
                leftSection={<IconWrapper icon={IconNotification} size={18} color="grape" />}
              >
                <Trans>Notifications</Trans>
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
