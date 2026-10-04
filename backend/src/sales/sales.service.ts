// sales.service.ts
import { Injectable } from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { Period, SalesPoint } from "./sales.validation";
import { SalesRow, toSalesPoints } from "./sales.domain";

// createdAt is stored as UTC; the chart follows the pharmacy's local time
const TIMEZONE = Prisma.raw(`'Asia/Manila'`);
const now = Prisma.sql`(now() AT TIME ZONE ${TIMEZONE})`;
const today = Prisma.sql`DATE_TRUNC('day', ${now})`;
const thisMonth = Prisma.sql`DATE_TRUNC('month', ${now})`;

interface Range {
  readonly from: Prisma.Sql; // first bucket start
  readonly to: Prisma.Sql; // last bucket start (never in the future)
  readonly step: Prisma.Sql;
  readonly until: Prisma.Sql; // end of the whole range, caps the last bucket
  readonly label: Prisma.Sql; // label of a bucket starting at `start`
}

const ranges: Readonly<Record<Period, Range>> = {
  Today: {
    from: today,
    to: Prisma.sql`DATE_TRUNC('hour', ${now})`,
    step: Prisma.sql`INTERVAL '1 hour'`,
    until: Prisma.sql`${today} + INTERVAL '1 day'`,
    label: Prisma.sql`TO_CHAR(start, 'FMHH12 AM')`,
  },
  Week: {
    from: Prisma.sql`${today} - INTERVAL '6 days'`,
    to: today,
    step: Prisma.sql`INTERVAL '1 day'`,
    until: Prisma.sql`${today} + INTERVAL '1 day'`,
    label: Prisma.sql`TO_CHAR(start, 'Dy')`,
  },
  // Wk 1 = 1st-7th, Wk 2 = 8th-14th, ... Wk 5 = 29th-end of month
  Month: {
    from: thisMonth,
    to: now,
    step: Prisma.sql`INTERVAL '7 days'`,
    until: Prisma.sql`${thisMonth} + INTERVAL '1 month'`,
    label: Prisma.sql`'Wk ' || ((EXTRACT(DAY FROM start)::int - 1) / 7 + 1)`,
  },
  Year: {
    from: Prisma.sql`${thisMonth} - INTERVAL '11 months'`,
    to: thisMonth,
    step: Prisma.sql`INTERVAL '1 month'`,
    until: Prisma.sql`${thisMonth} + INTERVAL '1 month'`,
    label: Prisma.sql`TO_CHAR(start, 'Mon')`,
  },
};

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  getSalesOverview(period: Period): Promise<readonly SalesPoint[]> {
    return this.completedSalesBy(ranges[period]).then(toSalesPoints);
  }

  // every bucket up to now, with ₱0 for buckets that had no sales.
  // All SQL pieces come from the fixed `ranges` map, never from user input.
  private completedSalesBy(range: Range) {
    return this.prisma.$queryRaw<SalesRow[]>`
      WITH buckets AS (
        SELECT start,
               LEAST(start + ${range.step}, ${range.until}) AS "end"
        FROM generate_series(${range.from}, ${range.to}, ${range.step}) AS start
      ),
      sales AS (
        SELECT ("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${TIMEZONE} AS at,
               "totalAmount"
        FROM "Transaction"
        WHERE status = 'COMPLETED'
      )
      SELECT ${range.label} AS label,
             COALESCE(SUM(s."totalAmount"), 0) AS total
      FROM buckets b
      LEFT JOIN sales s ON s.at >= b.start AND s.at < b."end"
      GROUP BY b.start
      ORDER BY b.start
    `;
  }
}
