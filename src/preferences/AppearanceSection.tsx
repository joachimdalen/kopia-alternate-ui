import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, Checkbox, Group, Loader, Select, Stack, Text, useMantineColorScheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import useApiRequest from "../core/hooks/useApiRequest";
import type { Preferences } from "../core/types";
import { parseColorScheme } from "../utils/parseColorScheme";
import supportedLocales from "./locales";

type PreferencesForm = {
  bytesStringBase2: string;
  theme: string;
  pageSize: string;
  locale: string;
  defaultSnapshotViewAll: boolean;
};

function AppearanceSection() {
  const { kopiaService } = useServerInstanceContext();
  const { setColorScheme } = useMantineColorScheme();
  const { reloadPreferences } = useAppContext();
  const [data, setData] = useState<Preferences>();
  const form = useForm<PreferencesForm, (values: PreferencesForm) => Preferences>({
    mode: "controlled",
    validateInputOnBlur: true,
    transformValues: (values) => {
      const pref: Preferences = {
        bytesStringBase2: values.bytesStringBase2 === "true",
        pageSize: parseInt(values.pageSize),
        theme: values.theme,
        defaultSnapshotViewAll: values.defaultSnapshotViewAll,
        fontSize: data!.fontSize,
        language: data!.language,
        locale: values!.locale
      };
      return pref;
    }
  });

  const loadPreferences = useApiRequest({
    action: () => kopiaService.getPreferences(),
    onReturn(resp) {
      setData(resp);
      form.initialize({
        bytesStringBase2: resp.bytesStringBase2.toString(),
        pageSize: resp.pageSize.toString() === "0" ? "20" : resp.pageSize.toString(),
        theme: parseColorScheme(resp.theme),
        locale: resp.locale || "en",
        defaultSnapshotViewAll: resp.defaultSnapshotViewAll
      });
    }
  });
  const setPreferences = useApiRequest<Preferences, Preferences>({
    action: (prefs?: Preferences) => kopiaService.setPreferences(prefs!),
    onReturn() {
      showNotification({
        title: t`Updated`,
        message: t`Preferences updated`,
        color: "green"
      });
      reloadPreferences();
    }
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
            label={t`Theme`}
            data={[
              { label: t`Light`, value: "light" },
              { label: t`Dark`, value: "dark" }
            ]}
            allowDeselect={false}
            withCheckIcon={false}
            {...form.getInputProps("theme")}
          />
          <Select
            label={t`Byte representation`}
            data={[
              {
                label: "Base-2 (KiB, MiB, GiB, TiB)",
                value: "true"
              },
              { label: "Base-10 (KB, MB, GB, TB)", value: "false" }
            ]}
            allowDeselect={false}
            withCheckIcon={false}
            {...form.getInputProps("bytesStringBase2")}
          />
        </Group>
        <Group grow>
          <Select
            label={t`Default page size`}
            data={[
              { label: "10", value: "10" },
              { label: "20", value: "20" },
              { label: "30", value: "30" },
              { label: "40", value: "40" },
              { label: "50", value: "50" },
              { label: "100", value: "100" }
            ]}
            allowDeselect={false}
            withCheckIcon={false}
            {...form.getInputProps("pageSize")}
          />
          <Select
            label={t`Locale`}
            data={Object.keys(supportedLocales).map((x) => ({
              label: supportedLocales[x].name,
              value: x
            }))}
            allowDeselect={false}
            withCheckIcon={false}
            renderOption={(o) => {
              const { flag: Flag } = supportedLocales[o.option.value];
              return (
                <Group wrap="nowrap" gap={4}>
                  <Flag style={{ height: 12, width: 20 }} />
                  <Text fz="sm">{o.option.label}</Text>
                </Group>
              );
            }}
            {...form.getInputProps("locale")}
          />
        </Group>
        <Checkbox
          label={t`Show all snapshots by default`}
          {...form.getInputProps("defaultSnapshotViewAll", {
            type: "checkbox"
          })}
        />
        <Group justify="flex-end" p="sm">
          <Button type="submit" color="green">
            <Trans>Save</Trans>
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default AppearanceSection;
