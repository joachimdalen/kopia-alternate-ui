import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  ActionIcon,
  Anchor,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { yupResolver } from "mantine-form-yup-resolver";
import * as Yup from "yup";
import IconWrapper from "../../../core/IconWrapper";
import modalBaseStyles from "../../../styles/modalStyles";
import modalClasses from "../../../styles/modals.module.css";

type Props = {
  items: string[];
  onCancel: () => void;
  onUpdated: (items: string[]) => void;
};

const schema = Yup.object({
  items: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().trim().required("Value is required"),
    })
  ),
});

type ItemsForm = {
  items: { id: string; value: string }[];
};

export default function PolicyListModal({ items, onCancel, onUpdated }: Props) {
  const form = useForm<ItemsForm, (values: ItemsForm) => string[]>({
    mode: "controlled",
    initialValues: {
      items: items.map((x) => ({ id: randomId(), value: x })),
    },
    validateInputOnBlur: true,
    validate: yupResolver(schema),
    transformValues: (values) => {
      return values.items.map((x) => x.value);
    },
  });

  function submitForm(values: string[]) {
    onUpdated(values);
    onCancel();
  }

  const fields = form.getValues().items.map((item, index) => (
    <Group key={item.id} mt="xs">
      <TextInput
        placeholder=".kopiaignore"
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`items.${index}.value`)}
        {...form.getInputProps(`items.${index}.value`)}
      />

      <ActionIcon
        color="red"
        onClick={() => form.removeListItem("items", index)}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  ));

  return (
    <Modal
      title={t`Update items`}
      onClose={onCancel}
      opened
      styles={modalBaseStyles}
      className={modalClasses.modalWrapper}
      closeOnClickOutside={false}
      size="sm"
    >
      <form
        id="add-items-form"
        onSubmit={form.onSubmit(submitForm)}
        className={modalClasses.container}
      >
        <Stack w="100%" gap="0">
          {fields}
          {form.errors.items && (
            <Text c="red" size="sm" mt="sm">
              {form.errors.items}
            </Text>
          )}
          <Group justify="start">
            <Anchor
              mt="sm"
              onClick={() => {
                form.insertListItem("items", {
                  value: "",
                  id: randomId(),
                });
                form.clearFieldError("items");
              }}
            >
              <Group gap={2}>
                <IconWrapper icon={IconPlus} size={16} />
                <Text fz="sm">
                  <Trans>Add</Trans>
                </Text>
              </Group>
            </Anchor>
          </Group>
          {form.errors.items && (
            <Text c="red" size="sm" mt="sm">
              {form.errors.items}
            </Text>
          )}
        </Stack>
      </form>

      <Group className={modalClasses.footer}>
        <Button
          size="xs"
          color="gray"
          variant="subtle"
          onClick={onCancel}
          disabled={false}
        >
          <Trans>Cancel</Trans>
        </Button>
        <Button
          size="xs"
          type="submit"
          form="add-items-form"
          disabled={!form.isValid()}
        >
          <Trans>Save</Trans>
        </Button>
      </Group>
    </Modal>
  );
}
