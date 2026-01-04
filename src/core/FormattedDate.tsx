import { useAppContext } from "./context/AppContext";
import formatLocalDate from "./dates/formatLocalDate";

type Props = {
  value: string;
};

export default function FormattedDate({ value }: Props) {
  const { locale } = useAppContext();
  return formatLocalDate(value, locale, "L LTS");
}
