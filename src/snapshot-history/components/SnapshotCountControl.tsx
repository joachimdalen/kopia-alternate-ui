import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Checkbox, Divider, Group, Stack, Text } from "@mantine/core";
import type { SourceInfo } from "../../core/types";

type Props = {
  currentLength: number;
  uniqueCount: number;
  totalLength?: number;
  sourceInfo: SourceInfo;
  showAll: boolean;
  onShowAll: (showAll: boolean) => void;
};

export default function SnapshotCountControl({
  currentLength,
  totalLength = 0,
  sourceInfo,
  uniqueCount,
  showAll,
  onShowAll
}: Props) {
  const limitedLength = t`${currentLength} out of ${totalLength}`;
  const textToDisplay = currentLength != totalLength ? limitedLength : totalLength;
  const userName = `${sourceInfo.userName}@${sourceInfo.host}:${sourceInfo.path}`;

  return (
    <Stack gap="xs">
      <Divider />
      <Group justify="space-between">
        <Text fz="sm">
          <Trans>Displaying {textToDisplay} snapshots of</Trans>
          <Text fw="bold" span fz="sm">
            {" "}
            {userName}
          </Text>
        </Text>
        {totalLength !== uniqueCount && (
          <Checkbox
            label={t`Show ${totalLength} individual snapshots`}
            checked={showAll}
            onChange={(event) => onShowAll(event.currentTarget.checked)}
          />
        )}
      </Group>
      <Divider />
    </Stack>
  );
}
