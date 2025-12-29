import dayjs from "dayjs";
import localFormat from "dayjs/plugin/localizedFormat";
import formatsByLocale from "./formatsByLocale";

dayjs.extend(localFormat);

export default function formatLocalDate(value: string, locale: string, format: string = "L LTS") {
  let currentFormat = formatsByLocale[locale];
  if (currentFormat === undefined) {
    currentFormat = formatsByLocale["en"];
  }

  return dayjs(value).locale(currentFormat).format(format).toString();
}
