import dayjs from "dayjs";
export function formatTimestamp(date: Date, format: string = "HH:mm:ss:SSS") {
  const startDate = dayjs(date);
  return startDate.format(format);
}
