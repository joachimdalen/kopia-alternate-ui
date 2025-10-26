import type { UseFormReturnType } from "@mantine/form";
import type { Policy } from "../../../core/types";

export type PolicyForm = {} & Policy;
export type PolicyInput = {
  form: UseFormReturnType<PolicyForm>;
  formKey: string;
};
