import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Anchor,
  Button,
  Center,
  Container,
  Divider,
  Group,
  SegmentedControl,
  Stack,
  TextInput,
  Title
} from "@mantine/core";
import { useDebouncedValue, useInputState } from "@mantine/hooks";
import {
  IconBan,
  IconCircleXFilled,
  IconClick,
  IconList,
  IconLoader,
  IconSearch,
  IconSettingsAutomation
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { refreshButtonProps } from "../core/commonButtons";
import { useAppContext } from "../core/context/AppContext";
import { useServerInstanceContext } from "../core/context/ServerInstanceContext";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import { MenuButton } from "../core/MenuButton/MenuButton";
import RelativeDate from "../core/RelativeDate";
import type { Task } from "../core/types";
import { onlyUnique } from "../utils/onlyUnique";
import TaskKindDisplay from "./components/TaskKindDisplay";
import TaskStatusDisplay from "./components/TaskStatusDisplay";

type StatusFilter = "all" | "running" | "failed";

function TasksPage() {
  const { kopiaService } = useServerInstanceContext();
  const { pageSize: tablePageSize } = useAppContext();
  const [data, setData] = useState<Task[]>();
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useInputState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const { error, execute, loading, loadingKey } = useApiRequest({
    action: () => kopiaService.getTasks(),
    onReturn(resp) {
      setData(resp.tasks);
    }
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
        <Title order={1}>
          <Trans>Tasks</Trans>
        </Title>
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
                      <span>
                        <Trans>All</Trans>
                      </span>
                    </Center>
                  ),
                  value: "all"
                },
                {
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconLoader size={16} color="var(--mantine-color-blue-5)" />
                      <span>
                        <Trans>Running</Trans>
                      </span>
                    </Center>
                  ),
                  value: "running"
                },
                {
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconCircleXFilled color="var(--mantine-color-red-5)" size={16} />
                      <span>
                        <Trans>Failed</Trans>
                      </span>
                    </Center>
                  ),
                  value: "failed"
                }
              ]}
            />
            <MenuButton
              prefix={t`Kind` + ":"}
              options={[
                { label: t`All`, value: "all" },
                { label: "divider", value: "divider" },
                ...(data || [])
                  .map((x) => x.kind)
                  .filter(onlyUnique)
                  .map((x) => ({
                    label: <TaskKindDisplay kind={x} />,
                    value: x
                  }))
              ]}
              onClick={setKindFilter}
              disabled={loading}
            />
          </Group>
          <Group>
            <TextInput
              size="sm"
              placeholder={t`Search tasks`}
              leftSection={<IconSearch size={18} stroke={1.5} />}
              value={query}
              onChange={setQuery}
            />
            <Button
              loading={loading && loadingKey === "refresh"}
              onClick={() => execute(undefined, "refresh")}
              {...refreshButtonProps}
            >
              <Trans>Refresh</Trans>
            </Button>
          </Group>
        </Group>
        <Divider />

        <ErrorAlert error={error} />

        <DataGrid
          loading={loading && loadingKey === "loading"}
          records={visibleTasks}
          noRecordsText="No tasks found"
          noRecordsIcon={<IconWrapper icon={IconSettingsAutomation} size={48} />}
          pageSize={tablePageSize}
          columns={[
            {
              accessor: "id",
              title: t`Task ID`,
              width: 75
            },
            {
              accessor: "startTime",
              title: t`Start Time`,
              render: (item) => (
                <Anchor component={Link} to={`/tasks/${item.id}`} td="none">
                  <RelativeDate value={item.startTime} />
                </Anchor>
              )
            },
            {
              accessor: "status",
              title: t`Status`,
              render: (item) => <TaskStatusDisplay task={item} />
            },
            {
              accessor: "kind",
              title: t`Kind`,
              render: (item) => <TaskKindDisplay kind={item.kind} />
            },
            {
              accessor: "description",
              title: t`Description`,
              visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.md})`
            },
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
                  <Button size="xs" variant="subtle" leftSection={<IconBan size={14} />} color="red">
                    <Trans context="cance-operation">Cancel</Trans>
                  </Button>
                )
            }
          ]}
        />
      </Stack>
    </Container>
  );
}

export default TasksPage;
