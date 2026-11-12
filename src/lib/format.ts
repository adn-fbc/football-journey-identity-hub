import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { MOCK_TODAY } from "@/data/mock";

export const fmtDate = (d: string, pattern = "d MMM yyyy") => format(parseISO(d), pattern);
export const fmtDay = (d: string) => format(parseISO(d), "EEE d MMM");
export const fmtMonthYear = (d: string) => format(parseISO(d), "MMM yyyy");

export function relativeDay(d: string) {
  const diff = differenceInCalendarDays(parseISO(d), parseISO(MOCK_TODAY));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff < 7) return format(parseISO(d), "EEEE");
  return fmtDay(d);
}

export const initials = (name: string) =>
  name.replace(/^(Coach|Ibu|Bapak)\s+/, "").split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();

/** Football age category for the 2026/27 season. */
export const ageCategoryFor = (birthYear: number) => `U${2027 - birthYear - 1}`;
