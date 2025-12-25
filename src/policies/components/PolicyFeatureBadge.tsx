import { Badge, type MantineColor } from "@mantine/core";
import {
  IconAlertTriangle,
  IconArrowsSplit,
  IconCalendarX,
  IconClock,
  IconDeviceLaptop,
  IconFileCode,
  IconFileText,
  IconFileZip,
  IconFolderCog,
  IconFolderOpen,
  IconQuestionMark,
  IconUpload
} from "@tabler/icons-react";
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
    color: "teal",
    icon: IconCalendarX,
    displayName: "Retention"
  },
  "files": {
    icon: IconFolderOpen,
    color: "yellow",
    displayName: "Files"
  },
  "errorHandling": {
    icon: IconAlertTriangle,
    color: "red",
    displayName: "Error Handling"
  },
  "scheduling": {
    icon: IconClock,
    color: "green",
    displayName: "Scheduling"
  },
  "compression": {
    icon: IconFileZip,
    color: "grape",
    displayName: "Compression"
  },
  "metadataCompression": {
    icon: IconFileCode,
    color: "gray",
    displayName: "Metadata Compression"
  },
  "splitter": {
    icon: IconArrowsSplit,
    color: "lime",
    displayName: "Splitter"
  },
  "actions": {
    icon: IconFolderCog,
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
    color: "violet",
    displayName: "Logging"
  },
  "upload": {
    icon: IconUpload,
    color: "blue",
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
