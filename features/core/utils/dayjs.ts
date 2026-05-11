import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import jalaliday from "jalaliday";
import "dayjs/locale/fa";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(jalaliday);

dayjs.tz.setDefault("Asia/Tehran");
dayjs.locale("fa");

export default dayjs;
