import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  AccordionItem,
  AccordionPanel,
  Alert,
  Anchor,
  Code,
  Group,
  InputWrapper,
  List,
  ListItem,
  Stack
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import PolicyListModal from "../../PolicyListModal/PolicyListModal";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  placeholder?: string;
  children?: React.ReactElement;
  effective?: string[];
  infoNode?: React.ReactNode;
} & PolicyInput;

export default function PolicyTextListInput({ id, title, description, children, form, formKey, infoNode }: Props) {
  const [open, openHandlers] = useDisclosure(false);
  const inputProps = form.getInputProps(formKey);
  const items = (inputProps.value as string[]) || [];
  const effectiveValues = (inputProps.value as string[]) || [];
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl
        title={title}
        description={description}
        isConfigured={inputProps.value !== undefined && inputProps.value !== "" && effectiveValues.length > 0}
      />
      <AccordionPanel>
        <Stack>
          {infoNode && (
            <Alert icon={<IconInfoCircle />} color="blue" p="xs">
              {infoNode}
            </Alert>
          )}
          <Group grow align="start">
            <Stack>
              <InputWrapper label={t`Defined`}>
                <List listStyleType="none" style={{ paddingInlineStart: 0 }}>
                  {items.length > 0 ? (
                    items.map((x) => (
                      <ListItem>
                        <Code>{x}</Code>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem fz="xs">
                      <Trans>Not defined</Trans>
                    </ListItem>
                  )}
                </List>
              </InputWrapper>
              <Anchor
                fz="xs"
                onClick={(e) => {
                  e.preventDefault();
                  openHandlers.open();
                }}
              >
                <Trans>Edit items</Trans>
              </Anchor>
            </Stack>
            <InputWrapper label={t`Effective`}>
              <List listStyleType="none" style={{ paddingInlineStart: 0 }}>
                {effectiveValues.length > 0 ? (
                  effectiveValues.map((x) => (
                    <ListItem>
                      <Code>{x}</Code>
                    </ListItem>
                  ))
                ) : (
                  <ListItem fz="xs">
                    <Trans>Not defined</Trans>
                  </ListItem>
                )}
              </List>
            </InputWrapper>
          </Group>
          {children}
        </Stack>
        {open && (
          <PolicyListModal
            items={inputProps.value || []}
            onCancel={openHandlers.close}
            onUpdated={(items) => form.setFieldValue(formKey, items)}
          />
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}
