import { Trans } from "@lingui/react/macro";
import { Button } from "@mantine/core";
import { IconFolderBolt, IconFolderMinus } from "@tabler/icons-react";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import useApiRequest from "../../core/hooks/useApiRequest";
import type { MountedSnapshot } from "../../core/types";

type Props = {
  mount?: MountedSnapshot;
  rootID: string;
  onMounted: (mnt?: MountedSnapshot) => void;
};

export default function MountButton({ mount, rootID, onMounted }: Props) {
  const { kopiaService } = useServerInstanceContext();

  const mountAction = useApiRequest({
    showErrorAsNotification: true,
    action: (oid?: string) => kopiaService.mountSnapshot(oid!),
    onReturn(mnt) {
      onMounted(mnt);
    }
  });
  const unMountAction = useApiRequest({
    showErrorAsNotification: true,
    action: (oid?: string) => kopiaService.unMountSnapshot(oid!),
    onReturn() {
      onMounted(undefined);
    }
  });
  return mount === undefined ? (
    <Button
      size="xs"
      color="grape"
      leftSection={<IconFolderBolt size={16} />}
      onClick={() => mountAction.execute(rootID)}
      loading={mountAction.loading}
    >
      <Trans>Mount</Trans>
    </Button>
  ) : (
    <Button
      size="xs"
      color="red"
      leftSection={<IconFolderMinus size={16} />}
      onClick={() => unMountAction.execute(rootID)}
      loading={unMountAction.loading}
    >
      <Trans>Unmount</Trans>
    </Button>
  );
}
