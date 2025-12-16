import {
  Badge,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Stack,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  IconClick,
  IconFileCertificate,
  IconPencil,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { usePreferencesContext } from "../core/context/PreferencesContext";
import { DataGrid } from "../core/DataGrid/DataGrid";
import { ErrorAlert } from "../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../core/hooks/useApiRequest";
import IconWrapper from "../core/IconWrapper";
import kopiaService from "../core/kopiaService";
import { MenuButton } from "../core/MenuButton/MenuButton";
import RepoTitle from "../core/RepoTitle/RepoTitle";
import {
  type ItemAction,
  type PolicyRef,
  type SourceInfo,
  type Sources,
} from "../core/types";
import { formatOwnerName } from "../utils/formatOwnerName";
import { onlyUnique } from "../utils/onlyUnique";
import CreatePolicyModal from "./modals/CreatePolicyModal/CreatePolicyModal";
import PolicyModal from "./modals/PolicyModal/PolicyModal";
import {
  getNonEmptyPolicies,
  isGlobalPolicy,
  isLocalHostPolicy,
  isLocalUserPolicy,
} from "./policiesUtil";

type PolicyFilter =
  | "applicable-policies"
  | "local-path-policies"
  | "all-policies"
  | "global-policy"
  | "per-user-policies"
  | "per-host-policies";

function PoliciesPage() {
  const { pageSize: tablePageSize } = usePreferencesContext();
  const [data, setData] = useState<PolicyRef[]>([]);
  const [sources, setSources] = useState<Sources>();
  const [searchParams] = useSearchParams();
  const [action, setAction] =
    useState<
      ItemAction<{ isNew: boolean; target: SourceInfo }, "edit" | "new">
    >();
  const [filterState, setFilterState] = useState<PolicyFilter | string>(
    "applicable-policies"
  );
  const { error, execute, loading, loadingKey } = useApiRequest({
    action: () => kopiaService.getPolicies(),
    onReturn(resp) {
      setData(resp.policies);
    },
  });
  const { execute: executeSources } = useApiRequest({
    action: () => kopiaService.getSnapshots(),
    onReturn(resp) {
      setSources(resp);
    },
  });

  const uniqueOwners = useMemo(
    () =>
      (sources?.sources || [])
        .map((x) => formatOwnerName(x.source))
        .filter(onlyUnique)
        .sort(),
    [sources]
  );

  const localSourceName = useMemo(() => {
    if (sources === undefined) return "";
    return `${sources.localUsername}@${sources.localHost}`;
  }, [sources]);

  useEffect(() => {
    execute(undefined, "loading");
    executeSources(undefined);
  }, []);

  useEffect(() => {
    if (searchParams === undefined || data === undefined || data.length === 0) {
      return;
    }
    if (!searchParams.has("viewPolicy", "true")) return;

    const host = searchParams.get("host");
    const user = searchParams.get("userName");
    const path = searchParams.get("path");
    if (host && user && path) {
      const policy = data.find(
        (x) =>
          x.target.host === host &&
          x.target.userName === user &&
          x.target.path === decodeURIComponent(path)
      );

      if (!policy) {
        showNotification({ message: "Failed to find policy", color: "red" });
        return;
      }

      setAction({
        action: "edit",
        item: {
          isNew: false,
          target: policy.target,
        },
      });
    }
  }, [searchParams, data]);

  const visibleData = useMemo(() => {
    let dta = [...data];
    switch (filterState) {
      case "all-policies":
        break;
      case "global-policy":
        dta = dta.filter(
          (x) => !x.target.userName && !x.target.host && !x.target.path
        );
        break;
      case "local-path-policies":
        dta = dta.filter((x) => isLocalUserPolicy(x, localSourceName));
        break;
      case "applicable-policies":
        dta = dta.filter(
          (x) =>
            isLocalUserPolicy(x, localSourceName) ||
            isLocalHostPolicy(x, sources?.localHost || "") ||
            isGlobalPolicy(x)
        );
        break;
      case "per-user-policies":
        dta = dta.filter(
          (x) => !!x.target.userName && !!x.target.host && !x.target.path
        );
        break;
      case "per-host-policies":
        dta = dta.filter(
          (x) => !x.target.userName && !!x.target.host && !x.target.path
        );
        break;
      default:
        dta = dta.filter((x) => formatOwnerName(x.target) === filterState);
        break;
    }
    return dta;
  }, [data, filterState, localSourceName, sources]);

  return (
    <Container fluid>
      <Stack>
        <RepoTitle />
        <Group justify="space-between">
          <MenuButton
            options={[
              { label: "Applicable Policies", value: "applicable-policies" },
              { label: "Local Path Policies", value: "local-path-policies" },
              { label: "All Policies", value: "all-policies" },
              { label: "", value: "divider" },
              { label: "Global Policy", value: "global-policy" },
              { label: "Per-User Policies", value: "per-user-policies" },
              { label: "Per-Host Policies", value: "per-host-policies" },
              { label: "", value: "divider" },
              ...uniqueOwners.map((own) => ({
                label: own,
                value: own,
              })),
            ]}
            onClick={setFilterState}
            disabled={loading}
          />
          <Group>
            <Button
              size="xs"
              leftSection={<IconPlus size={16} />}
              color="green"
              disabled={loading}
              onClick={() => setAction({ action: "new" })}
            >
              New Policy
            </Button>
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
          idAccessor="id"
          records={visibleData}
          loading={loading && loadingKey === "loading"}
          noRecordsText="No policies found"
          noRecordsIcon={<IconWrapper icon={IconFileCertificate} size={48} />}
          pageSize={tablePageSize}
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
                  onClick={() =>
                    setAction({
                      action: "edit",
                      item: {
                        isNew: false,
                        target: item.target,
                      },
                    })
                  }
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
          isNew={action.item!.isNew}
          target={action.item!.target}
          onCancel={() => setAction(undefined)}
        />
      )}
      {action &&
        action.action === "new" &&
        sources?.localHost &&
        sources.localUsername && (
          <CreatePolicyModal
            localHost={sources.localHost}
            localUserName={sources?.localUsername}
            onCancel={() => setAction(undefined)}
            onEdit={(target: SourceInfo, isNew: boolean) =>
              setAction({ action: "edit", item: { target, isNew } })
            }
          />
        )}
    </Container>
  );
}

export default PoliciesPage;
