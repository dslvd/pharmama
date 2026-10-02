const LOCALE = "en-PH";
const TZ = "Asia/Manila";

// "₱ 1,234.50"
const twoDecimals = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const peso = (amount: number) => `₱ ${twoDecimals.format(amount)}`;

// all dates/times shown in the pharmacy's timezone, not the browser's
const dateFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  year: "numeric",
  month: "short",
  day: "numeric",
});
const timeFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});
const longDayFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  weekday: "long",
  month: "long",
  day: "numeric",
});

// "Oct 2, 2026"
export const formatDate = (d: Date | string) => dateFmt.format(new Date(d));
// "3:45 PM"
export const formatTime = (d: Date | string) => timeFmt.format(new Date(d));
// "Friday, October 2"
export const formatLongDay = (d: Date | string) =>
  longDayFmt.format(new Date(d));
