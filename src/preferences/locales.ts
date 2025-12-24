
import { NO, US, type FlagComponent } from 'country-flag-icons/react/3x2';
const supportedLocales: Record<string, { name: string, cc: string; flag: FlagComponent }> =
{
    en: {
        name: "English",
        cc: "US",
        flag: US
    },
    nb: {
        name: "Norsk - Bokmål",
        cc: "NO",
        flag: NO
    }
}

export default supportedLocales;