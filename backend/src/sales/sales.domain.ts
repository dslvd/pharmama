// Pure sales-overview rules: how query rows become chart points.
// No database, no Nest.
import { SalesPoint } from "./sales.validation";

export interface SalesRow {
  readonly label: string;
  readonly total: unknown; // SUM() of a Decimal column comes back as a Decimal/string
}

export const toSalesPoints = (
  rows: readonly SalesRow[],
): readonly SalesPoint[] =>
  rows.map((row) => ({ label: row.label, value: Number(row.total) }));
