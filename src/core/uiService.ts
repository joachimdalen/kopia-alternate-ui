import { clientGet } from "./clientApiFetch";
import type { ApiResponse } from "./types";

export type Instance = {
  id: string;
  name: string;
};

function getInstances(): Promise<ApiResponse<Instance[]>> {
  return clientGet("/instances");
}
const methods = {
  getInstances,
};

export default methods;
