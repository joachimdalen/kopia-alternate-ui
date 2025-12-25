import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import { useServerInstanceContext } from "../../../../core/context/ServerInstanceContext";
import useApiRequest from "../../../../core/hooks/useApiRequest";
import type { SourceInfo } from "../../../../core/types";

type Props = {
  sourceInfo: SourceInfo;
  onDeleted: () => void;
};

export default function DeletePolicyButton({ sourceInfo, onDeleted }: Props) {
  const { kopiaService } = useServerInstanceContext();
  const { execute, loading } = useApiRequest({
    action: () => kopiaService.deletePolicy(sourceInfo),
    onReturn() {
      onDeleted();
    },
    showErrorAsNotification: true
  });

  const openModal = () =>
    modals.openConfirmModal({
      title: t`Delete policy`,
      children: (
        <Text size="sm">
          <Trans>Are you sure you want to delete this policy?</Trans>
        </Text>
      ),
      labels: { confirm: t`Delete policy`, cancel: t`No don't delete it` },
      confirmProps: { color: "red", size: "xs" },
      cancelProps: { size: "xs" },
      onConfirm: () => execute()
    });

  return (
    <Button size="xs" leftSection={<IconTrash size={16} />} color="red" loading={loading} onClick={openModal}>
      <Trans>Delete</Trans>
    </Button>
  );
}
