import {
  Button,
  Group,
  Loader,
  Select,
  Stack,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import useApiRequest from "../core/hooks/useApiRequest";
import type { Preferences } from "../core/types";

type PreferencesForm = {
  bytesStringBase2: string;
  theme: string;
  pageSize: string;
};

function AppearanceSection() {
  const { kopiaService } = useServerInstanceContext();
  const { setColorScheme } = useMantineColorScheme();
  const { reloadPreferences } = useAppContext();
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
        pageSize:
          resp.pageSize.toString() === "0" ? "20" : resp.pageSize.toString(),
        theme: resp.theme.toString() || "light",
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
      reloadPreferences();
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
  if (loadPreferences.loading) {
    return <Loader />;
  }

  return (
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
  );
}

export default AppearanceSection;
