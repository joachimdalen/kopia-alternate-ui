import { t } from "@lingui/core/macro";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  JsonInput,
  ScrollAreaAutosize,
  Switch,
  TabsPanel
} from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import PolicyAccordionControl from "../components/PolicyAccordionControl";
import type { PolicyForm } from "../types";

type Props = {
  form: UseFormReturnType<PolicyForm>;
};

export default function OtherTab({ form }: Props) {
  return (
    <TabsPanel value="other" px="xs">
      <ScrollAreaAutosize mah={600} scrollbarSize={4}>
        <Accordion variant="contained">
          <AccordionItem value="disable-parent-policy-eval">
            <PolicyAccordionControl
              title={t`Disable Parent Policy Evaluation`}
              description={t`Prevents any parent policies from affecting this directory and its subdirectories`}
              isConfigured={form.values.noParent !== undefined}
            />
            <AccordionPanel>
              <Switch
                label={t`Disable Parent Policy`}
                {...form.getInputProps("noParent", {
                  type: "checkbox"
                })}
              />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="json-policy">
            <PolicyAccordionControl
              title={t`JSON Representation`}
              description={t`This is the internal representation of a policy`}
              isConfigured={true}
            />
            <AccordionPanel>
              <JsonInput rows={10} value={JSON.stringify(form.values, null, 2)} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </ScrollAreaAutosize>
    </TabsPanel>
  );
}
