import type { Policy, PolicyRef, SourceInfo } from "../core/types";
import { formatOwnerName } from "../utils/formatOwnerName";

function isEmptyObject(obj: object) {
  return (
    Object.getPrototypeOf(obj) === Object.prototype &&
    Object.getOwnPropertyNames(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0
  );
}

function isEmpty(obj: unknown) {
  for (const key in obj as object) {
    if (Object.prototype.hasOwnProperty.call(obj, key))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return isEmptyObject((obj as any)[key]);
  }
  return true;
}

export function getNonEmptyPolicies(policies: PolicyRef) {
  const bits = [];

  for (const pol in policies.policy) {
    if (!isEmpty(policies.policy[pol as keyof Policy])) {
      bits.push(pol);
    }
  }
  return bits;
}

export function getPolicyType(s: SourceInfo) {
  if (!s.host && !s.userName) {
    return "Global Policy";
  }

  if (!s.userName) {
    return "Host: " + s.host;
  }

  if (!s.path) {
    return "User: " + s.userName + "@" + s.host;
  }

  return "Directory: " + s.userName + "@" + s.host + ":" + s.path;
}

export function isGlobalPolicy(x: PolicyRef) {
  return !x.target.userName && !x.target.host && !x.target.path;
}
export function isLocalUserPolicy(x: PolicyRef, localSourceName: string) {
  return formatOwnerName(x.target) === localSourceName;
}
export function isLocalHostPolicy(x: PolicyRef, localHost: string) {
  return !x.target.userName && x.target.host === localHost && !x.target.path;
}
