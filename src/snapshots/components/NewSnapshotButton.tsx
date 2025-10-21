import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { SourceInfo } from "../../core/types";

import useApiRequest from "../../core/hooks/useApiRequest";
import kopiaService from "../../core/kopiaService";
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
