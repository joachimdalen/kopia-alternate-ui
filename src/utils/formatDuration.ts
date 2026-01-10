import dayjs from "dayjs";

export function formatDuration(nanoseconds: number) {
  const duration = dayjs.duration(nanoseconds / 1000 / 1000, "milliseconds");
  const totalHours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  const formatted = `${totalHours}h ${minutes}m ${seconds}s`;
  return formatted;
}
