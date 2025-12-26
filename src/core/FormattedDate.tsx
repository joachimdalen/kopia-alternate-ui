import dayjs from "dayjs";
import localFormat from "dayjs/plugin/localizedFormat";
import { useAppContext } from "./context/AppContext";
import formatsByLocale from "./dates/formatsByLocale";

dayjs.extend(localFormat);

type Props = {
  value: string;
};

export default function FormattedDate({ value }: Props) {
  const { locale } = useAppContext();
  let currentFormat = formatsByLocale[locale];
  if (currentFormat === undefined) {
    currentFormat = formatsByLocale["en"];
  }

  return dayjs(value).locale(currentFormat).format("L LTS").toString();
}
