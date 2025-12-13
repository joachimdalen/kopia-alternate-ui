import {
  Group,
  Paper,
  SimpleGrid,
  Text,
  type MantineColor,
} from "@mantine/core";
import {
  IconCircleX,
  IconDatabasePlus,
  IconFileCode,
  IconFileDatabase,
  IconFileUpload,
  IconFileX,
  IconFolderX,
  IconHash,
  IconHome,
  IconRefresh,
  IconUpload,
} from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type { Task } from "../../core/types";

type Props = {
  task: Task;
  showZeroCounters: boolean;
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
    color: "blue",
  },
  "Cached Files": {
    icon: IconFileDatabase,
    color: "blue",
  },
  Errors: {
    icon: IconCircleX,
    color: "red",
  },
  "Excluded Directories": {
    icon: IconFolderX,
    color: "yellow",
  },
  "Excluded Files": {
    icon: IconFileX,
    color: "yellow",
  },
  "Hashed Bytes": {
    icon: IconHash,
    color: "blue",
  },
  "Hashed Files": {
    icon: IconFileCode,
    color: "blue",
  },
  "Processed Bytes": {
    icon: IconRefresh,
    color: "green",
  },
  "Processed Files": {
    icon: IconFileUpload,
    color: "green",
  },
  "Uploaded Bytes": {
    icon: IconUpload,
    color: "green",
  },
};

export default function TaskCounterGrid({ task, showZeroCounters }: Props) {
  const counters = Object.keys(task.counters).map((key) => {
    const counter = task.counters[key as CounterKeys];
    const iconProp = iconProps[key as CounterKeys];
    if (counter.value == 0 && !showZeroCounters) return null;
    return (
      <Paper withBorder radius="md" p="xs">
        <Group>
          <IconWrapper icon={iconProp.icon} size={32} color={iconProp.color} />

          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {key}
            </Text>
            <Text fw={700} size="xl">
              {counter.value}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid cols={6}>{counters}</SimpleGrid>;
}
