import {
  ActionIcon,
  Anchor,
  Button,
  Center,
  Container,
  Divider,
  Group,
  SegmentedControl,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useDebouncedValue, useInputState } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconBan,
  IconCircleXFilled,
  IconClick,
  IconList,
  IconLoader,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import kopiaService from "../core/kopiaService";
import { MenuButton } from "../core/MenuButton/MenuButton";
import RelativeDate from "../core/RelativeDate";
import type { Task } from "../core/types";
import { onlyUnique } from "../utils/onlyUnique";
import TaskStatusDisplay from "./components/TaskStatusDisplay";

type StatusFilter = "all" | "running" | "failed";

function TasksPage() {
  const [data, setData] = useState<Task[]>();
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useInputState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const { error, execute, loading, loadingKey } = useApiRequest({
    action: () => kopiaService.getTasks(),
    onReturn(resp) {
      setData(resp.tasks);
    },
  });

  useEffect(() => {
    execute(undefined, "loading");
  }, []);

  const visibleTasks = useMemo(() => {
    let items = [...(data || [])];

    if (kindFilter != "all") {
      items = items.filter((x) => x.kind === kindFilter);
    }

    if (statusFilter != "all") {
      items = items.filter((x) => x.status === statusFilter?.toUpperCase());
    }

    if (debouncedQuery !== "") {
      items = items.filter((x) => x.description.indexOf(debouncedQuery) !== -1);
    }

    return items;
  }, [data, kindFilter, statusFilter, debouncedQuery]);

  return (
    <Container fluid>
      <Stack>
        <Group>
          <ActionIcon variant="subtle" component={Link} to="/snapshots">
            <IconArrowLeft size={24} />
          </ActionIcon>
          <Title order={1}>Something</Title>
        </Group>

        <Group justify="space-between" align="flex-end">
          <Group>
            <SegmentedControl
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as StatusFilter)}
              data={[
                {
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconList size={16} />
                      <span>All</span>
                    </Center>
                  ),
                  value: "all",
                },
                {
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconLoader
                        size={16}
                        color="var(--mantine-color-blue-5)"
                      />
                      <span>Running</span>
                    </Center>
                  ),
                  value: "running",
                },
                {
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconCircleXFilled
                        color="var(--mantine-color-red-5)"
                        size={16}
                      />
                      <span>Failed</span>
                    </Center>
                  ),
                  value: "failed",
                },
              ]}
            />
            <MenuButton
              prefix="Kind:"
              options={[
                { label: "All", value: "all" },
                { label: "divider", value: "divider" },
                ...(data || [])
                  .map((x) => x.kind)
                  .filter(onlyUnique)
                  .map((x) => ({ label: x, value: x })),
              ]}
              onClick={setKindFilter}
              disabled={loading}
            />
          </Group>
          <Group>
            <TextInput
              radius="xl"
              size="sm"
              placeholder="Search tasks"
              leftSection={<IconSearch size={18} stroke={1.5} />}
              value={query}
              onChange={setQuery}
            />
            <Button
              size="xs"
              leftSection={<IconRefresh size={16} />}
              variant="light"
              loading={loading && loadingKey === "refresh"}
              onClick={() => execute(undefined, "refresh")}
            >
              Refresh
            </Button>
          </Group>
        </Group>
        <Divider />

        <ErrorAlert error={error} />

        <DataGrid
          loading={loading && loadingKey === "loading"}
          records={visibleTasks}
          columns={[
            {
              accessor: "startTime",
              render: (item) => (
                <Anchor component={Link} to={``} td="none">
                  <RelativeDate value={item.startTime} />
                </Anchor>
              ),
            },
            {
              accessor: "status",
              render: (item) => <TaskStatusDisplay task={item} />,
            },
            { accessor: "kind" },
            { accessor: "description" },
            {
              accessor: "actions",
              title: (
                <Center>
                  <IconClick size={16} />
                </Center>
              ),
              width: "0%", // 👈 use minimal width
              render: (item) =>
                item.status === "RUNNING" && (
                  <Button
                    size="xs"
                    variant="subtle"
                    leftSection={<IconBan size={14} />}
                    color="red"
                  >
                    Cancel
                  </Button>
                ),
            },
          ]}
        />
      </Stack>
    </Container>
  );
}

export default TasksPage;
