export default function deleteUnusedProps<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deleteUnusedProps).filter((v) => v != null) as unknown as T;
  }

  const newObj: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value != null) {
        if (typeof value === "string" && value === "") {
          continue;
        }
        if (typeof value === "number" && value === -1) {
          continue;
        }
        if (Array.isArray(value) && value.length === 0) {
          continue;
        }
        if (typeof value === "object" && Object.keys(value).length === 0) {
          continue;
        }
        newObj[key] = deleteUnusedProps(value);
      }
    }
  }
  return newObj as T;
}
