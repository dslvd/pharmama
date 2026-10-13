// turns the sales query rows into chart points
import { Period, SalesPoint } from "./sales.validation";

// the pharmacy's timezone, for both the grouping and the labels
export const TIMEZONE = "Asia/Manila";

export interface SalesRow {
  readonly bucket: Date; // start of the bucket
  readonly total: unknown; // Postgres returns SUM() as a Decimal
}

const dayOfMonth = (d: Date) =>
  Number(d.toLocaleDateString("en-US", { day: "numeric", timeZone: TIMEZONE }));

// how each period labels its bars
const labelFor: Readonly<Record<Period, (bucket: Date) => string>> = {
  Today: (d) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", timeZone: TIMEZONE }),
  Week: (d) =>
    d.toLocaleDateString("en-US", { weekday: "short", timeZone: TIMEZONE }),
  // Wk 1 = 1st-7th, Wk 2 = 8th-14th, ... Wk 5 = 29th-end of month
  Month: (d) => `Wk ${Math.floor((dayOfMonth(d) - 1) / 7) + 1}`,
  Year: (d) =>
    d.toLocaleDateString("en-US", { month: "short", timeZone: TIMEZONE }),
};

export const toSalesPoints =
  (period: Period) =>
  (rows: readonly SalesRow[]): readonly SalesPoint[] =>
    rows.map((row) => ({
      label: labelFor[period](new Date(row.bucket)),
      value: Number(row.total),
    }));
