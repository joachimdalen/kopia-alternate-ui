import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, Group, Modal, Textarea } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import modalBaseStyles from "../../../styles/modalStyles";
import modalClasses from "../../../styles/modals.module.css";
import type { PolicyForm } from "../PolicyModal/types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
  formKey: string;
  onClose: () => void;
};

export default function PolicyCodeEditModal({ form, formKey, onClose }: Props) {
  return (
    <Modal
      title={t`Edit script`}
      onClose={onClose}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="xl"
    >
      <div className={modalClasses.container}>
        <Textarea w="100%" miw={400} resize="both" rows={20} {...form.getInputProps(formKey)} />
      </div>

      <Group className={modalClasses.footer} style={{ justifyContent: "flex-end" }}>
        <Button size="xs" onClick={onClose}>
          <Trans>Close</Trans>
        </Button>
      </Group>
    </Modal>
  );
}
