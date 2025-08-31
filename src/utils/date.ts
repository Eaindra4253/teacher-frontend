import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

export function formatDate(date: Date | string) {
  dayjs.extend(timezone);
  return dayjs(date).tz("Asia/Yangon").format("YYYY-MMM-DD hh:mm:ss A");
}
