// Pure sales-overview rules: how each period's buckets are labelled and how
// query rows become chart points. No database, no Nest.
import { Period, SalesPoint } from "./sales.validation";

// the pharmacy's local time; the query buckets sales in this timezone too
export const TIMEZONE = "Asia/Manila";

export interface SalesRow {
  readonly bucket: Date; // start of the bucket
  readonly total: unknown; // SUM() of a Decimal column comes back as a Decimal/string
}

const dayOfMonth = (d: Date) =>
  Number(d.toLocaleDateString("en-US", { day: "numeric", timeZone: TIMEZONE }));

// one label function per period, picked by key
export const labelFor: Readonly<Record<Period, (bucket: Date) => string>> = {
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
