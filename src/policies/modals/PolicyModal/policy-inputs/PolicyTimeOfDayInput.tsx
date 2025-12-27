import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { AccordionItem, AccordionPanel, Anchor, Code, Group, InputWrapper, List, ListItem, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { TimeOfDay } from "../../../../core/types";
import PolicyTodModal from "../../PolicyTodModal/PolicyTodModal";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyInput } from "../types";

type Props = {
  id: string;
  title: string;
  description: string;
  children?: React.ReactElement;
  effective?: TimeOfDay[];
} & PolicyInput;

export default function PolicyTimeOfDayInput({ id, title, description, children, form, formKey, effective }: Props) {
  const [open, openHandlers] = useDisclosure(false);
  const inputProps = form.getInputProps(formKey);
  const items = (inputProps.value as TimeOfDay[]) || [];
  const effectiveValues = (inputProps.value as TimeOfDay[]) || effective || [];
  return (
    <AccordionItem value={id}>
      <PolicyAccordionControl
        title={title}
        description={description}
        isConfigured={inputProps.value !== undefined && inputProps.value !== "" && (effective || []).length > 0}
      />
      <AccordionPanel>
        <Stack>
          <Group grow align="start">
            <Stack>
              <InputWrapper label={t`Defined`}>
                <List listStyleType="none" style={{ paddingInlineStart: 0 }}>
                  {items.length > 0 ? (
                    items.map((x) => (
                      <ListItem>
                        <Code>{`${x.hour.toString().padStart(2, "0")}:${x.min.toString().padStart(2, "0")}`}</Code>
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
                      <Code>{`${x.hour.toString().padStart(2, "0")}:${x.min.toString().padStart(2, "0")}`}</Code>
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
          <PolicyTodModal
            items={inputProps.value || []}
            onCancel={openHandlers.close}
            onUpdated={(items) => form.setFieldValue(formKey, items)}
          />
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}
