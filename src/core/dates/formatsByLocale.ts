import enLocale from "dayjs/locale/en";
import nbLocale from "dayjs/locale/nb";
import nnLocale from "dayjs/locale/nn";

const formats: Record<string, ILocale> = {
  en: enLocale,
  nb: nbLocale,
  nn: nnLocale
};

export default formats;
