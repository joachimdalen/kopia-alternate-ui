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
      // biome-ignore lint/suspicious/noExplicitAny: object can be any object
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

export function checkPolicyPath(path: string) {
  if (path === "(global)") {
    return "Cannot create the global policy, it already exists.";
  }

  // Check for a path before anything else and short-circuit
  // On Windows this avoids issues with the colon in C:/path
  if (isAbsolutePath(path)) {
    return null;
  }

  const p1 = path.indexOf("@");
  const p2 = path.indexOf(":");

  // user@host:path
  if (p1 > 0 && p2 > 0 && p1 < p2 && p2 < path.length) {
    path = path.substring(p2 + 1);
  } else if (p1 >= 0 && p2 < 0) {
    if (p1 + 1 < path.length) {
      // @host and user@host without path
      return null;
    }

    return "Policies must have a hostname.";
  }

  // We already know it isn't an absolute path,
  // nor is it a fully specified policy target,
  // so it's either completely invalid, or a relative path
  return "Policies can not be defined for relative paths.";
}
export function isAbsolutePath(p: string) {
  // Unix-style path.
  if (p.startsWith("/")) {
    return true;
  }

  // Windows-style X:\... path.
  if (p.length >= 3 && p.substring(1, 3) === ":\\") {
    const letter = p.substring(0, 1).toUpperCase();

    return letter >= "A" && letter <= "Z";
  }

  // Windows UNC path.
  if (p.startsWith("\\\\")) {
    return true;
  }

  return false;
}

export function getEffectiveValue(value?: string, effective?: string) {
  return value || effective || "";
}
