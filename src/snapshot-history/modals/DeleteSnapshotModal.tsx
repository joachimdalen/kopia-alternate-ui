import { Button, Checkbox, Group, Modal, Stack, Text } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useServerInstanceContext } from "../../core/context/ServerInstanceContext";
import { ErrorAlert } from "../../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../../core/hooks/useApiRequest";
import {
  type DeleteSnapshotRequest,
  type Snapshot,
  type SourceInfo,
} from "../../core/types";
import modalClasses from "../../styles/modals.module.css";
import modalBaseStyles from "../../styles/modalStyles";

type Props = {
  source: SourceInfo;
  snapshots: Snapshot[];
  isAll: boolean;
  onCancel: () => void;
  onDeleted: (deleteAll: boolean) => void;
};

export default function DeleteSnapshotModal({
  onCancel,
  onDeleted,
  isAll,
  snapshots,
  source,
}: Props) {
  const { kopiaService } = useServerInstanceContext();
  const [deleteAll, setDeleteAll] = useInputState(false);
  const deleteSnapshotAction = useApiRequest({
    action: (data?: DeleteSnapshotRequest) =>
      kopiaService.deleteSnapshot(data!),
    onReturn: () => {
      onDeleted(deleteAll);
    },
  });

  function deleteSnapshots() {
    const req: DeleteSnapshotRequest = {
      source,
      snapshotManifestIds: snapshots.map((x) => x.id),
      deleteSourceAndPolicy: deleteAll,
    };
    deleteSnapshotAction.execute(req);
  }

  return (
    <Modal
      title="Delete snapshot?"
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="md"
    >
      <Stack w="100%" className={modalClasses.container}>
        <ErrorAlert error={deleteSnapshotAction.error} />
        {snapshots.length === 1 ? (
          <Text fz="sm">Do you want to delete the selected snapshot?</Text>
        ) : (
          <Text fz="sm">
            Do you want to delete the selected{" "}
            <Text span fw="bold" fz="sm">
              {snapshots.length} snapshots
            </Text>
            ?
          </Text>
        )}
        {isAll && (
          <Checkbox
            label="Wipe all snapshots and the policy for this source"
            checked={deleteAll}
            onChange={setDeleteAll}
            size="xs"
          />
        )}
      </Stack>

      <Group className={modalClasses.footer}>
        <Button
          size="xs"
          color="gray"
          variant="subtle"
          onClick={onCancel}
          disabled={deleteSnapshotAction.loading}
        >
          Cancel
        </Button>

        <Button
          size="xs"
          color="red"
          onClick={() => deleteSnapshots()}
          loading={deleteSnapshotAction.loading}
        >
          Delete
        </Button>
      </Group>
    </Modal>
  );
}
