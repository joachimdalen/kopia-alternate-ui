//const locale = "en-US";
const base10UnitPrefixes = ["", "K", "M", "G", "T"];
const base2UnitPrefixes = ["", "Ki", "Mi", "Gi", "Ti"];

function formatNumber(f: number) {
  return Math.round(f * 10) / 10.0 + "";
}

function toDecimalUnitString(
  f: number,
  thousand: number,
  prefixes: string[],
  suffix: string
) {
  for (let i = 0; i < prefixes.length; i++) {
    if (f < 0.9 * thousand) {
      return formatNumber(f) + " " + prefixes[i] + suffix;
    }
    f /= thousand;
  }

  return formatNumber(f) + " " + prefixes[prefixes.length - 1] + suffix;
}

export default function sizeDisplayName(
  size: number,
  bytesStringBase2: boolean
) {
  if (size === undefined) {
    return "";
  }
  if (bytesStringBase2) {
    return toDecimalUnitString(size, 1024, base2UnitPrefixes, "B");
  }
  return toDecimalUnitString(size, 1000, base10UnitPrefixes, "B");
}
