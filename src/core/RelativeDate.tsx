import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type Props = {
  value: string;
};

export default function RelativeDate({ value }: Props) {
  return dayjs(value).fromNow();
}
