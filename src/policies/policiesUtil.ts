import type { PolicyRef } from "../core/types";

function isEmptyObject(obj: object) {
  return (
    Object.getPrototypeOf(obj) === Object.prototype &&
    Object.getOwnPropertyNames(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0
  );
}

function isEmpty(obj: object) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key))
      return isEmptyObject(obj[key]);
  }
  return true;
}

export function getNonEmptyPolicies(policies: PolicyRef) {
  const bits = [];

  for (const pol in policies.policy) {
    if (!isEmpty(policies.policy[pol])) {
      bits.push(pol);
    }
  }
  return bits;
}
