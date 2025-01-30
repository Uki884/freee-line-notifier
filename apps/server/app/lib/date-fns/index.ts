import { subYears } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { startOfYear } from "date-fns/startOfYear";

// タイムゾーンをJSTに指定してフォーマットする
export function formatJST(
  date: string | Date,
  format: string | undefined = "yyyy/MM/dd HH:mm",
) {
  return formatInTimeZone(date, "Asia/Tokyo", format);
}

export const lastStartOfYear = (date: string | Date) => {
  const subDate = subYears(date, 1);
  return startOfYear(subDate);
};
