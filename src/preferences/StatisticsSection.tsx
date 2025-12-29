import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Alert, Checkbox, Stack } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

function StatisticsSection() {
  const [enableStats, setEnableState] = useLocalStorage<boolean>({
    key: "kaui-snapshot-stats",
    defaultValue: true
  });

  return (
    <Stack>
      <Alert title={t`Settings stored locally`} color="grape">
        <Trans>
          Due to this being a local feature and not a feature in Kopia, these settings are only stored in the local
          browser. This means that switching browsers or instances you will have to re-apply the settings.
        </Trans>
      </Alert>
      <Checkbox
        label={t`Enable snapshot statistics`}
        description={t`When enabled, will show snapshot statistics`}
        checked={enableStats}
        onChange={(e) => setEnableState(e.target.checked)}
      />
    </Stack>
  );
}

export default StatisticsSection;
