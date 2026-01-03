import dayjs from "dayjs";

export function isPastDateTime(dateTime: string, locale: string): boolean {
  const s = dayjs(dateTime).locale(locale).isBefore(dayjs().locale(locale));
  console.log(s);
  return s;
}
