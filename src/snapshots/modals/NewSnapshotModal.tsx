import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconFileCode, IconSearch } from "@tabler/icons-react";
import { yupResolver } from "mantine-form-yup-resolver";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { ErrorAlert } from "../../core/ErrorAlert/ErrorAlert";
import useApiRequest from "../../core/hooks/useApiRequest";
import kopiaService from "../../core/kopiaService";
import {
  type CreateSnapshotRequest,
  type Policy,
  type SourceInfo,
} from "../../core/types";
import PolicyModal from "../../policies/modals/PolicyModal/PolicyModal";
import modalClasses from "../../styles/modals.module.css";
import modalBaseStyles from "../../styles/modalStyles";
import TaskEstimationModal from "./TaskEstimationModal";

type Props = {
  onCancel: () => void;
  onSnapshotted: () => void;
};

const schema = Yup.object({
  path: Yup.string().required().label("Path"),
});

type NewSnapshotForm = {
  path: string;
};

export default function NewSnapshotModal({ onCancel, onSnapshotted }: Props) {
  const [showEditor, setShowEditor] = useDisclosure(false);
  const [showEstimation, showEstimationHandlers] = useDisclosure(false);
  const [isExisting, setIsExisting] = useState<boolean>(false);
  const [source, setSource] = useState<SourceInfo>();
  const [policy, setPolicy] = useState<Policy>();
  const form = useForm<NewSnapshotForm>({
    mode: "controlled",
    initialValues: {
      path: "",
    },
    validate: yupResolver(schema),
  });

  const getPolicyAction = useApiRequest({
    action: (data?: SourceInfo) => kopiaService.getPolicy(data!),
    onReturn: (p) => {
      setIsExisting(true);
      setPolicy(p);
    },
  });

  const resolvePolicyAction = useApiRequest({
    action: (data?: SourceInfo) =>
      kopiaService.resolvePolicy(data!, {
        numUpcomingSnapshotTimes: 5,
        updates: {},
      }),
    onReturn: (g) => {
      setPolicy(g.defined);
      getPolicyAction.execute(source);
    },
  });

  const resolvePathAction = useApiRequest({
    action: (data?: string) => kopiaService.resolvePath(data!),
    onReturn: (g) => {
      setSource(g.source);
    },
  });
  const createSnapshotAction = useApiRequest({
    action: (data?: CreateSnapshotRequest) =>
      kopiaService.createSnapshot(data!),
    onReturn: () => {
      onSnapshotted();
    },
  });

  useEffect(() => {
    if (source != undefined) {
      resolvePolicyAction.execute(source);
    }
  }, [source]);

  return (
    <Modal
      title="New snapshot"
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="md"
    >
      <Stack w="100%" className={modalClasses.container}>
        <ErrorAlert
          error={resolvePathAction.error || createSnapshotAction.error}
        />

        <Group grow align="flex-end">
          <TextInput
            label="Path to snapshot"
            withAsterisk
            placeholder="/some/path/here"
            disabled={source !== undefined}
            rightSection={
              <ActionIcon
                size={24}
                variant="filled"
                disabled={!form.isValid("path") || source !== undefined}
                loading={resolvePathAction.loading}
                onClick={() => resolvePathAction.execute(form.values.path)}
              >
                <IconSearch size={14} stroke={1.5} />
              </ActionIcon>
            }
            {...form.getInputProps("path")}
          />
        </Group>
        {source && (
          <Button
            mt="xs"
            size="xs"
            color="grape"
            leftSection={<IconFileCode size={18} />}
            onClick={setShowEditor.open}
          >
            Change policy parameters
          </Button>
        )}
      </Stack>

      <Group className={modalClasses.footer}>
        <Button
          size="xs"
          color="gray"
          variant="subtle"
          onClick={onCancel}
          disabled={createSnapshotAction.loading || resolvePathAction.loading}
        >
          Cancel
        </Button>

        <Group>
          <Button
            size="xs"
            color="teal"
            disabled={
              source === undefined ||
              policy === undefined ||
              createSnapshotAction.loading
            }
            onClick={showEstimationHandlers.open}
          >
            Estimate
          </Button>
          <Button
            size="xs"
            disabled={source === undefined || policy === undefined}
            loading={createSnapshotAction.loading}
            onClick={() => {
              const req: CreateSnapshotRequest = {
                createSnapshot: true,
                path: form.values.path,
                policy: policy!,
              };
              createSnapshotAction.execute(req);
            }}
          >
            Snapshot now
          </Button>
        </Group>
      </Group>
      {showEditor && source && (
        <PolicyModal
          target={source}
          isNew={!isExisting}
          onCancel={setShowEditor.close}
          saveOnSubmit={false}
          onSubmitted={(policy) => {
            setPolicy(policy);
            setShowEditor.close();
          }}
        />
      )}
      {showEstimation && source && policy && (
        <TaskEstimationModal
          policy={policy}
          source={source}
          onCancel={showEstimationHandlers.close}
        />
      )}
    </Modal>
  );
}
