import { Trans } from "@lingui/react/macro";
import { Group, Loader, Progress, Stack, Text } from "@mantine/core";
import type { UploadCounters } from "../../core/types";
import sizeDisplayName from "../../utils/formatSize";

type Props = {
  data?: UploadCounters;
  bytesStringBase2: boolean;
};

export default function UploadingLoader({ data, bytesStringBase2 }: Props) {
  if (data === undefined)
    return (
      <Group>
        <Loader size="xs" type="dots" />
        <Text fz="xs">
          <Trans>Uploading</Trans>
        </Text>
      </Group>
    );
  const totalBytes = data.hashedBytes + data.cachedBytes;
  const totalBytesString = sizeDisplayName(totalBytes, bytesStringBase2);

  if (!data.estimatedBytes) {
    return (
      <Group>
        <Loader size="xs" type="dots" />
        <Text fz="xs">{totalBytesString}</Text>
      </Group>
    );
  }

  const estimatedBytesString = sizeDisplayName(
    data.estimatedBytes,
    bytesStringBase2
  );
  const percent =
    Math.round((totalBytes * 1000.0) / data.estimatedBytes) / 10.0;

  return (
    <Stack gap={5}>
      <Progress value={percent} animated striped />
      <Text fz="xs" ta="center">
        {totalBytesString} / {estimatedBytesString} ({percent}%)
      </Text>
    </Stack>
  );
}
