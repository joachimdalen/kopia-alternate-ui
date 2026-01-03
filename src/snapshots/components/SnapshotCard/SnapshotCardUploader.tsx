import { Trans } from "@lingui/react/macro";
import { Progress, Stack, Text } from "@mantine/core";
import type { UploadCounters } from "../../../core/types";
import sizeDisplayName from "../../../utils/formatSize";
import classes from "./SnapshotCard.module.css";

type Props = {
  data?: UploadCounters;
  bytesStringBase2: boolean;
};

export default function SnapshotCardUploader({ data, bytesStringBase2 }: Props) {
  if (data === undefined)
    return (
      <Stack gap={5} my="sm">
        <Progress
          radius="xs"
          value={50}
          size="lg"
          classNames={{
            section: classes.progressMarquee
          }}
        />
        <Text fz="xs" ta="center">
          <Trans>Uploading</Trans>
        </Text>
      </Stack>
    );
  const totalBytes = data.hashedBytes + data.cachedBytes;
  const totalBytesString = sizeDisplayName(totalBytes, bytesStringBase2);

  if (!data.estimatedBytes) {
    return (
      <Stack gap={5} my="sm">
        <Progress
          radius="xs"
          value={50}
          size="lg"
          classNames={{
            section: classes.progressMarquee
          }}
        />
        <Text fz="xs" ta="center">
          {totalBytesString}
        </Text>
      </Stack>
    );
  }

  const estimatedBytesString = sizeDisplayName(data.estimatedBytes, bytesStringBase2);
  const percent = Math.round((totalBytes * 1000.0) / data.estimatedBytes) / 10.0;

  return (
    <Stack gap={5}>
      <Progress value={percent} animated striped size="lg" />
      <Text fz="xs" ta="center">
        {totalBytesString} / {estimatedBytesString} ({percent}%)
      </Text>
    </Stack>
  );
}
