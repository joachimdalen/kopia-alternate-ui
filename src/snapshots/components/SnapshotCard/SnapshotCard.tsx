import { Trans } from "@lingui/react/macro";
import {
  ActionIcon,
  Anchor,
  Badge,
  Card,
  Group,
  Menu,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Tooltip
} from "@mantine/core";
import { IconArchive, IconDots, IconEye, IconFolderOpen, IconFolderRoot } from "@tabler/icons-react";
import { useMemo } from "react";
import { Link } from "react-router";
import IconWrapper from "../../../core/IconWrapper";
import RelativeDate from "../../../core/RelativeDate";
import type { SourceStatus } from "../../../core/types";
import sizeDisplayName from "../../../utils/formatSize";
import classes from "./SnapshotCard.module.css";
import SnapshotCardUploader from "./SnapshotCardUploader";

type Props = {
  item: SourceStatus;
  bytesStringBase2: boolean;
  snapshotLoading: boolean;
  onTakeSnapshot: () => void;
};

export default function SnapshotCard({ item, bytesStringBase2, snapshotLoading, onTakeSnapshot }: Props) {
  const stats = useMemo(() => {
    const s = [
      {
        title: "Owner",
        value:
          item.status === "REMOTE" ? (
            <Group gap="xs" align="center">
              <Text fz="sm">{`${item.source.userName}@${item.source.host}`}</Text>
              <Badge size="sm" radius={5} tt="none" variant="light" color="grape">
                <Trans>Remote</Trans>
              </Badge>
            </Group>
          ) : (
            `${item.source.userName}@${item.source.host}`
          )
      },
      {
        title: "Size",
        value:
          item.lastSnapshot?.rootEntry?.summ?.size &&
          sizeDisplayName(item.lastSnapshot.rootEntry.summ.size, bytesStringBase2)
      },
      { title: "Start Time", value: item.lastSnapshot ? <RelativeDate value={item.lastSnapshot.startTime} /> : "-" },
      { title: "Next snapshot", value: item.nextSnapshotTime ? <RelativeDate value={item.nextSnapshotTime} /> : "-" }
    ];
    return s;
  }, [item]);

  const items = stats.map((stat) => (
    <div key={stat.title}>
      <Text size="xs" c="dimmed">
        {stat.title}
      </Text>
      <Text fw={500} size="sm">
        {stat.value}
      </Text>
    </div>
  ));
  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between" wrap="nowrap">
          <Group
            gap="5"
            wrap="nowrap"
            style={{
              flex: "1 1 100%",
              minWidth: "0"
            }}
          >
            <IconWrapper
              icon={item.status === "REMOTE" ? IconFolderRoot : IconFolderOpen}
              color={item.status === "REMOTE" ? "grape" : "yellow"}
              size={18}
            />
            <Anchor
              component={Link}
              to={{
                pathname: "/snapshots/single-source",
                search: `?userName=${item.source.userName}&host=${item.source.host}&path=${encodeURIComponent(item.source.path)}`
              }}
              td="none"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              <Tooltip label={item.source.path}>
                <Text
                  fz="sm"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {item.source.path}
                </Text>
              </Tooltip>
            </Anchor>
          </Group>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                style={{
                  width: "30",
                  height: "30"
                }}
              >
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {item.status !== "REMOTE" && (
                <Menu.Item
                  leftSection={<IconWrapper icon={IconArchive} color="green" size={14} />}
                  disabled={snapshotLoading || item.status !== "IDLE"}
                  onClick={onTakeSnapshot}
                >
                  Snapshot Now
                </Menu.Item>
              )}
              <Menu.Item
                leftSection={<IconWrapper icon={IconEye} size={14} color="blue" />}
                component={Link}
                to={{
                  pathname: "/policies",
                  search: `userName=${item.source.userName}&host=${item.source.host}&path=${encodeURIComponent(item.source.path)}&viewPolicy=true`
                }}
              >
                View Policy
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>
      <Card.Section className={classes.footer}>
        <SimpleGrid cols={2} w="100%">
          {items}
        </SimpleGrid>
      </Card.Section>
      <Card.Section inheritPadding>
        {item.status === "PENDING" && (
          <Stack gap={5} my="sm">
            <Progress color="yellow" radius="xs" value={100} animated size="lg" />
            <Text fz="xs" ta="center">
              <Trans>Pending</Trans>
            </Text>
          </Stack>
        )}
        {item.status === "UPLOADING" && <SnapshotCardUploader data={item.upload} bytesStringBase2 />}
      </Card.Section>
    </Card>
  );
}
