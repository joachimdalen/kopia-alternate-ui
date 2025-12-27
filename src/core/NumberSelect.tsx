import { Select, type SelectProps } from "@mantine/core";

interface Props extends Omit<SelectProps, "value" | "onChange"> {
  value?: number | string;
  onChange?: (value: number) => void;
  defaultIfNotSet?: string;
}

export default function NumberSelect({ value, onChange, defaultIfNotSet, ...rest }: Props) {
  return (
    <Select {...rest} value={value?.toString() || defaultIfNotSet} onChange={(it) => onChange?.(Number(it) || 0)} />
  );
}
