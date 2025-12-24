import { Trans } from "@lingui/react/macro";
import { Center, SegmentedControl } from "@mantine/core";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconHierarchy,
} from "@tabler/icons-react";
import IconWrapper from "../../../../core/IconWrapper";

type Props = {
  value?: boolean;
  onChange?: (value?: boolean) => void;
  disabled?: boolean;
};

export default function InheritYesNoPolicyControl({
  value,
  onChange,
  disabled,
}: Props) {
  const intValue = value === undefined ? "inherit" : value ? "yes" : "no";
  return (
    <SegmentedControl
      value={intValue}
      readOnly={disabled}
      onChange={(v) => {
        if (onChange === undefined) return;
        switch (v) {
          case "inherit":
            onChange(undefined);
            break;
          case "yes":
            onChange(true);
            break;
          case "no":
            onChange(false);
            break;
        }
      }}
      data={[
        {
          label: (
            <Center style={{ gap: 10 }}>
              <IconWrapper icon={IconHierarchy} color="yellow" size={16} />
              <span>
                <Trans>Inherit</Trans></span>
            </Center>
          ),
          value: "inherit",
        },
        {
          label: (
            <Center style={{ gap: 10 }}>
              <IconWrapper
                icon={IconCircleCheckFilled}
                color="green"
                size={16}
              />
              <span><Trans>Yes</Trans></span>
            </Center>
          ),
          value: "yes",
        },
        {
          label: (
            <Center style={{ gap: 10 }}>
              <IconWrapper icon={IconCircleXFilled} color="red" size={16} />
              <span><Trans>No</Trans></span>
            </Center>
          ),
          value: "no",
        },
      ]}
    />
  );
}
