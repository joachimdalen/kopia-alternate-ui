import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type Props = {
  value: string;
  format?: string;
};

export default function FormattedDate({ value, format = "YYYY-MM-DD" }: Props) {
  return dayjs(value).format(format).toString();
}
