import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import useApiRequest from "../../core/hooks/useApiRequest";
import type { SourceInfo } from "../../core/types";
type Props = {
  disabled?: boolean;
  sourceInfo: SourceInfo;
  onSnapshot: () => void;
};

export default function NewSnapshotButton({
  disabled,
  sourceInfo,
  onSnapshot,
}: Props) {
  const { kopiaService } = useServerInstanceContext();
  const { execute, loading } = useApiRequest({
    action: () => kopiaService.startSnapshot(sourceInfo),
    onReturn() {
      onSnapshot();
    },
    showErrorAsNotification: true,
  });

  return (
    <Button
      size="xs"
      leftSection={<IconPlus size={16} />}
      color="green"
      disabled={disabled}
      loading={loading}
      onClick={() => execute()}
    >
      New Snapshot
    </Button>
  );
}
