// Pure sales-overview rules: which bucket each period uses and how rows
// become chart points. No database, no Nest.
import { Period, SalesPoint } from "./sales.validation";

export type Bucket = "hour" | "day" | "week" | "month";

export interface SalesRow {
  readonly bucket: Date;
  readonly total: unknown; // SUM() of a Decimal column comes back as a Decimal/string
}

export const bucketFor: Readonly<Record<Period, Bucket>> = {
  Today: "hour",
  Week: "day",
  Month: "week",
  Year: "month",
};

const labelFor: Readonly<
  Record<Period, (bucket: Date, index: number) => string>
> = {
  Today: (d) => d.toLocaleTimeString("en-US", { hour: "numeric" }),
  Week: (d) => d.toLocaleDateString("en-US", { weekday: "short" }),
  Month: (_d, i) => `Wk ${i + 1}`,
  Year: (d) => d.toLocaleDateString("en-US", { month: "short" }),
};

export const toSalesPoints =
  (period: Period) =>
  (rows: readonly SalesRow[]): readonly SalesPoint[] =>
    rows.map((row, i) => ({
      label: labelFor[period](new Date(row.bucket), i),
      value: Number(row.total),
    }));
