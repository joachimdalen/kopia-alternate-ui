import {
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconNotification, IconPalette } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { usePreferencesContext } from "../core/context/PreferencesContext";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import kopiaService from "../core/kopiaService";
import RepoTitle from "../core/RepoTitle/RepoTitle";
import type { Preferences } from "../core/types";
import NotificationsSection from "./NotificationsSection";

type PreferencesForm = {
  bytesStringBase2: string;
  theme: string;
  pageSize: string;
};

function PreferencesPage() {
  const { setColorScheme } = useMantineColorScheme();
  const { reload } = usePreferencesContext();
  const [data, setData] = useState<Preferences>();
  const form = useForm<
    PreferencesForm,
    (values: PreferencesForm) => Preferences
  >({
    mode: "controlled",
    validateInputOnBlur: true,
    transformValues: (values) => {
      const pref: Preferences = {
        bytesStringBase2: values.bytesStringBase2 === "true",
        pageSize: parseInt(values.pageSize),
        theme: values.theme,
        defaultSnapshotViewAll: data!.defaultSnapshotViewAll,
        fontSize: data!.fontSize,
        language: data!.language,
      };
      return pref;
    },
  });

  const loadPreferences = useApiRequest({
    action: () => kopiaService.getPreferences(),
    onReturn(resp) {
      setData(resp);
      form.initialize({
        bytesStringBase2: resp.bytesStringBase2.toString(),
        pageSize: resp.pageSize.toString(),
        theme: resp.theme.toString(),
      });
    },
  });
  const setPreferences = useApiRequest<Preferences, Preferences>({
    action: (prefs?: Preferences) => kopiaService.setPreferences(prefs!),
    onReturn() {
      showNotification({
        title: "Updated",
        message: "Preferences updated",
        color: "green",
      });
      reload();
    },
  });

  useEffect(() => {
    loadPreferences.execute(undefined, "loading");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submitForm(values: Preferences) {
    setColorScheme(values.theme as "light" | "dark");
    setPreferences.execute(values);
  }

  return (
    <Container fluid>
      <Stack w="100%">
        <RepoTitle />

        <Divider />
        <ErrorAlert error={loadPreferences.error} />
        {!loadPreferences.loading && (
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
                <form onSubmit={form.onSubmit(submitForm)}>
                  <Stack>
                    <Group grow>
                      <Select
                        label="Theme"
                        data={[
                          { label: "Light", value: "light" },
                          { label: "Dark", value: "dark" },
                        ]}
                        allowDeselect={false}
                        withCheckIcon={false}
                        {...form.getInputProps("theme")}
                      />
                      <Select
                        label="Byte representation"
                        data={[
                          {
                            label: "Base-2 (KiB, MiB, GiB, TiB)",
                            value: "true",
                          },
                          { label: "Base-10 (KB, MB, GB, TB)", value: "false" },
                        ]}
                        allowDeselect={false}
                        withCheckIcon={false}
                        {...form.getInputProps("bytesStringBase2")}
                      />
                    </Group>
                    <Group grow>
                      <Select
                        label="Default page size"
                        data={[
                          { label: "10", value: "10" },
                          { label: "20", value: "20" },
                          { label: "30", value: "30" },
                          { label: "40", value: "40" },
                          { label: "50", value: "50" },
                          { label: "100", value: "100" },
                        ]}
                        allowDeselect={false}
                        withCheckIcon={false}
                        {...form.getInputProps("pageSize")}
                      />
                    </Group>
                    <Group justify="flex-end" p="sm">
                      <Button type="submit" color="green">
                        Save
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </TabsPanel>
              <TabsPanel value="notifications">
                <NotificationsSection />
              </TabsPanel>
            </Tabs>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}

export default PreferencesPage;
