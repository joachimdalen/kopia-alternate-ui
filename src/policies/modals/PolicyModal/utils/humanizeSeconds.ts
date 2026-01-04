import dayjs from "dayjs";

export function humanizeSeconds(seconds: number, locale: string) {
  return dayjs.duration(seconds, "seconds").locale(locale).humanize();
}
