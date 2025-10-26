import { Anchor, Breadcrumbs, Group, Tooltip } from "@mantine/core";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DirectoryCrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = [];

  for (let state = location.state; state; state = state.prevState) {
    breadcrumbs.unshift(state);
  }
  return (
    <Breadcrumbs>
      {breadcrumbs.map((state, i) => {
        const index = breadcrumbs.length - i - 1; // revert index
        return (
          <Anchor
            key={index}
            size="sm"
            onClick={() => {
              if (index) navigate(-index);
            }}
          >
            <Group gap="2">
              {state.label}
              {state.oid && !index && (
                <Tooltip label={`OID: ${state.oid}`}>
                  <IconInfoCircleFilled size={16} />
                </Tooltip>
              )}
            </Group>
          </Anchor>
        );
      })}
    </Breadcrumbs>
  );
}
