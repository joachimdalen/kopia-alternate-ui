import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAppContext } from "./context/AppContext";
import formatsByLocale from "./dates/formatsByLocale";

dayjs.extend(relativeTime);

type Props = {
  value: string;
};

export default function RelativeDate({ value }: Props) {
  const { locale } = useAppContext();
  let currentFormat = formatsByLocale[locale];
  if (currentFormat === undefined) {
    currentFormat = formatsByLocale["en"];
  }

  return dayjs(value).locale(currentFormat).fromNow();
}
