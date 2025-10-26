import {
  Badge,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Stack,
} from "@mantine/core";
import {
  IconClick,
  IconPencil,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import kopiaService from "../core/kopiaService";
import RepoTitle from "../core/RepoTitle/RepoTitle";
import { type ItemAction, type PolicyRef, type Snapshot } from "../core/types";
import PolicyModal from "./modals/PolicyModal/PolicyModal";
import { getNonEmptyPolicies } from "./policiesUtil";

function PoliciesPage() {
  const [data, setData] = useState<PolicyRef[]>([]);
  const [action, setAction] = useState<ItemAction<PolicyRef, "edit">>();

  const { error, execute, loading, loadingKey } = useApiRequest({
    action: () => kopiaService.getPolicies(),
    onReturn(resp) {
      setData(resp.policies);
    },
  });

  useEffect(() => {
    execute(undefined, "loading");
  }, []);

  return (
    <Container fluid>
      <Stack>
        <RepoTitle />
        <Group justify="space-between">
          <Group>
            <Button
              size="xs"
              leftSection={<IconPlus size={16} />}
              color="green"
              disabled={loading}
              component={Link}
              to="/snapshots/new"
            >
              New Snapshot
            </Button>
          </Group>
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
        <Divider />
        <ErrorAlert error={error} />
        <DataGrid
          idAccessor="id"
          records={data}
          loading={loading && loadingKey === "loading"}
          columns={[
            {
              accessor: "target.username",
              render: (item) => item.target.userName || "*",
            },
            {
              accessor: "target.host",
              render: (item) => item.target.host || "*",
            },
            {
              accessor: "target.path",
              render: (item) => item.target.path || "*",
            },
            {
              accessor: "defined",
              render: (item) => (
                <Group gap="xs">
                  {getNonEmptyPolicies(item).map((x) => (
                    <Badge tt="none" key={x}>
                      {x}
                    </Badge>
                  ))}
                </Group>
              ),
            },
            {
              accessor: "actions",
              title: (
                <Center>
                  <IconClick size={16} />
                </Center>
              ),
              width: "0%", // 👈 use minimal width
              render: (item) => (
                <Button
                  size="xs"
                  variant="subtle"
                  leftSection={<IconPencil size={14} />}
                  color="yellow"
                  onClick={() => setAction({ action: "edit", item: item })}
                >
                  Edit
                </Button>
              ),
            },
          ]}
        />
      </Stack>
      {action && action.action === "edit" && (
        <PolicyModal
          policy={action.item}
          onCancel={() => setAction(undefined)}
          onUpdated={function (snapshots: Snapshot[]): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </Container>
  );
}

export default PoliciesPage;
