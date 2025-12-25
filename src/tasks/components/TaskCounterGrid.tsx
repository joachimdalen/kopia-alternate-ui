import { Group, Paper, SimpleGrid, Text, type MantineColor, type StyleProp } from "@mantine/core";
import {
  IconAsterisk,
  IconCircleX,
  IconDatabasePlus,
  IconFile,
  IconFileCode,
  IconFileDatabase,
  IconFileMinus,
  IconFilePlus,
  IconFileSymlink,
  IconFileUpload,
  IconFileX,
  IconFolder,
  IconFolderPlus,
  IconFolderX,
  IconHash,
  IconHome,
  IconPlayerSkipForward,
  IconRefresh,
  IconUpload
} from "@tabler/icons-react";
import { useAppContext } from "../../core/context/AppContext";
import IconWrapper from "../../core/IconWrapper";
import type { Task } from "../../core/types";
import sizeDisplayName from "../../utils/formatSize";

type Props = {
  task: Task;
  showZeroCounters: boolean;
  gridSize?: StyleProp<number>;
};

type CounterKeys = keyof Task["counters"];

const iconProps: Record<
  CounterKeys,
  {
    icon: typeof IconHome;
    color: MantineColor;
  }
> = {
  "Cached Bytes": {
    icon: IconDatabasePlus,
    color: "blue"
  },
  "Cached Files": {
    icon: IconFileDatabase,
    color: "blue"
  },
  Errors: {
    icon: IconCircleX,
    color: "red"
  },
  "Excluded Directories": {
    icon: IconFolderX,
    color: "yellow"
  },
  "Excluded Files": {
    icon: IconFileX,
    color: "yellow"
  },
  "Hashed Bytes": {
    icon: IconHash,
    color: "blue"
  },
  "Hashed Files": {
    icon: IconFileCode,
    color: "blue"
  },
  "Processed Bytes": {
    icon: IconRefresh,
    color: "green"
  },
  "Processed Files": {
    icon: IconFileUpload,
    color: "green"
  },
  "Uploaded Bytes": {
    icon: IconUpload,
    color: "green"
  },
  "Ignored Errors": {
    icon: IconCircleX,
    color: "yellow"
  },
  "Restored Bytes": {
    icon: IconCircleX,
    color: "green"
  },
  "Restored Directories": {
    icon: IconFolderPlus,
    color: "green"
  },
  "Restored Files": {
    icon: IconFilePlus,
    color: "green"
  },
  "Restored Symlinks": {
    icon: IconFileSymlink,
    color: "red"
  },
  "Skipped Bytes": {
    icon: IconPlayerSkipForward,
    color: "orange"
  },
  "Skipped Files": {
    icon: IconFileMinus,
    color: "orange"
  },
  Files: {
    icon: IconFile,
    color: "green"
  },
  Directories: {
    icon: IconFolder,
    color: "green"
  },
  Bytes: {
    icon: IconAsterisk,
    color: "blue"
  },
  "Excluded Bytes": {
    icon: IconAsterisk,
    color: "yellow"
  }
};

export default function TaskCounterGrid({ task, showZeroCounters, gridSize }: Props) {
  const { bytesStringBase2 } = useAppContext();

  if (task.counters === undefined || task.counters === null) return null;

  const counters = Object.keys(task.counters).map((key) => {
    const counter = task.counters[key as CounterKeys];

    if (counter === undefined) return null;
    const iconProp = iconProps[key as CounterKeys];

    if (counter.value == 0 && !showZeroCounters) return null;

    let formatted = counter.value.toLocaleString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((counter as any).units === "bytes") {
      formatted = sizeDisplayName(counter.value, bytesStringBase2);
    }

    return (
      <Paper withBorder radius="md" p="xs" key={key}>
        <Group wrap="nowrap">
          {iconProp && <IconWrapper icon={iconProp.icon} size={32} color={iconProp.color} />}

          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {key}
            </Text>
            <Text fw={700} size="xl">
              {formatted}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid cols={gridSize || { base: 1, sm: 3, md: 4, lg: 6 }}>{counters}</SimpleGrid>;
}
