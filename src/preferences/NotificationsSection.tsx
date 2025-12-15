import { Button, Divider, Group, Menu, SimpleGrid, Stack } from "@mantine/core";
import {
  IconBrandPushover,
  IconChevronDown,
  IconMail,
  IconWebhook,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import useApiRequest from "../core/hooks/useApiRequest";
import kopiaService from "../core/kopiaService";
import type {
  ItemAction,
  NotificationProfile,
  NotificationType,
} from "../core/types";
import NotificationCard from "./components/NotificationCard";
import EmailModal from "./modals/EmailModal";
import PushoverModal from "./modals/PushoverModal";
import WebhookModal from "./modals/WebhookModal";

function NotificationsSection() {
  const [action, setAction] =
    useState<
      ItemAction<
        { type: NotificationType; profile?: NotificationProfile },
        "edit" | "new"
      >
    >();
  const [data, setData] = useState<NotificationProfile[]>([]);
  const loadAction = useApiRequest({
    action: () => kopiaService.getNotificationProfiles(),
    onReturn(resp) {
      setData(resp.sort((a, b) => a.profile.localeCompare(b.profile)));
    },
  });
  const deleteAction = useApiRequest({
    action: (data?: string) => kopiaService.deleteNotificationProfile(data!),
    showErrorAsNotification: true,
    onReturn(_, profileName) {
      setData((prev) => prev.filter((x) => x.profile != profileName));
    },
  });
  useEffect(() => {
    loadAction.execute(undefined, "loading");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={0}>
      <Stack gap={0}>
        <Group>
          <Menu
            transitionProps={{ transition: "pop-top-right" }}
            position="top-end"
            withinPortal
            radius="md"
          >
            <Menu.Target>
              <Button
                rightSection={<IconChevronDown size={18} stroke={1.5} />}
                pr={12}
                variant="subtle"
                color="green"
              >
                Create new
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconWebhook size={16} stroke={1.5} />}
                onClick={() =>
                  setAction({ action: "new", item: { type: "webhook" } })
                }
              >
                Webhook
              </Menu.Item>
              <Menu.Item
                leftSection={<IconMail size={16} stroke={1.5} />}
                onClick={() =>
                  setAction({ action: "new", item: { type: "email" } })
                }
              >
                Email
              </Menu.Item>
              <Menu.Item
                leftSection={<IconBrandPushover size={16} stroke={1.5} />}
                onClick={() =>
                  setAction({ action: "new", item: { type: "pushover" } })
                }
              >
                Pushover
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Divider />
      </Stack>
      <Stack p="md">
        <SimpleGrid cols={{ base: 1, sm: 3, xl: 4 }}>
          {data.map((n) => (
            <NotificationCard
              key={n.profile}
              disabled={
                deleteAction.loading && deleteAction.loadingKey === n.profile
              }
              data={n}
              onDelete={() => deleteAction.execute(n.profile, n.profile)}
              onEdit={() =>
                setAction({
                  action: "edit",
                  item: {
                    type: n.method.type,
                    profile: n,
                  },
                })
              }
              onDuplicate={() => console.log("d")}
              onTest={() => console.log("test")}
            />
          ))}
        </SimpleGrid>
      </Stack>
      {action && action.item?.type === "webhook" && (
        <WebhookModal
          onCancel={() => setAction(undefined)}
          onSaved={(profile, isCreate) => {
            if (isCreate) {
              setData((prev) => [...prev, profile]);
            } else {
              loadAction.execute(undefined, "refresh");
            }
            setAction(undefined);
          }}
          profile={action.item.profile}
        />
      )}
      {action && action.item?.type === "email" && (
        <EmailModal
          onCancel={() => setAction(undefined)}
          onSaved={(profile, isCreate) => {
            if (isCreate) {
              setData((prev) => [...prev, profile]);
            } else {
              loadAction.execute(undefined, "refresh");
            }
            setAction(undefined);
          }}
          profile={action.item.profile}
        />
      )}
      {action && action.item?.type === "pushover" && (
        <PushoverModal
          onCancel={() => setAction(undefined)}
          onSaved={(profile, isCreate) => {
            if (isCreate) {
              setData((prev) => [...prev, profile]);
            } else {
              loadAction.execute(undefined, "refresh");
            }
            setAction(undefined);
          }}
          profile={action.item.profile}
        />
      )}
    </Stack>
  );
}

export default NotificationsSection;
