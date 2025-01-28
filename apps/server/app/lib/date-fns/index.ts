import { formatInTimeZone } from "date-fns-tz";

// タイムゾーンをJSTに指定してフォーマットする
export function formatJST(date: string | Date, format: string | undefined = "yyyy/MM/dd HH:mm") {
  return formatInTimeZone(date, "Asia/Tokyo", format);
}
