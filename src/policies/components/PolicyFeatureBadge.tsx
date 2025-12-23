import { Badge, type MantineColor } from "@mantine/core";
import { IconArchive, IconArrowsSplit, IconCircleX, IconDeviceLaptop, IconFile, IconFileCode, IconFileText, IconQuestionMark, IconStopwatch, IconTerminal, IconUpload, IconZip, type IconClock } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

type Props = {
  policyFeature: string;
};

const policyFeatures: {
  [key: string]: {
    color: MantineColor,
    icon: typeof IconClock,
    displayName: string;
  }
} = {
  "retention": {
    color: "grape",
    icon: IconArchive,
    displayName: "Retention"
  },
  "files": {
    icon: IconFile,
    color: "cyan",
    displayName: "Files"
  },
  "errorHandling": {
    icon: IconCircleX,
    color: "red",
    displayName: "Error Handling"
  },
  "scheduling": {
    icon: IconStopwatch,
    color: "teal",
    displayName: "Scheduling"
  },
  "compression": {
    icon: IconZip,
    color: "yellow",
    displayName: "Compression"
  },
  "metadataCompression": {
    icon: IconFileCode,
    color: "grape",
    displayName: "Metadata Compression"
  },
  "splitter": {
    icon: IconArrowsSplit,
    color: "indigo",
    displayName: "Splitter"
  },
  "actions": {
    icon: IconTerminal,
    color: "lime",
    displayName: "Actions"
  },
  "osSnapshots": {
    icon: IconDeviceLaptop,
    color: "orange",
    displayName: "OS Snapshots"
  },
  "logging": {
    icon: IconFileText,
    color: "pink",
    displayName: "Logging"
  },
  "upload": {
    icon: IconUpload,
    color: "violet",
    displayName: "Upload"
  },
}

export default function PolicyFeatureBadge({ policyFeature }: Props) {
  const feature = policyFeatures[policyFeature] || {
    icon: IconQuestionMark,
    color: "blue",
    displayName: policyFeature
  }

  return (
    <Badge tt="none" color={feature.color} radius={5} leftSection={<IconWrapper icon={feature.icon} />}>
      {feature.displayName}
    </Badge>
  );
}
