// sales.service.ts
import { Injectable } from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { Period, SalesPoint } from "./sales.validation";
import { SalesRow, TIMEZONE, toSalesPoints } from "./sales.domain";

// createdAt is stored as UTC; buckets follow the pharmacy's local time
const tz = Prisma.raw(`'${TIMEZONE}'`);
const now = Prisma.sql`(now() AT TIME ZONE ${tz})`;
const today = Prisma.sql`DATE_TRUNC('day', ${now})`;
const thisMonth = Prisma.sql`DATE_TRUNC('month', ${now})`;

interface Range {
  readonly from: Prisma.Sql; // first bucket start
  readonly to: Prisma.Sql; // last bucket start (never in the future)
  readonly step: Prisma.Sql;
  readonly until: Prisma.Sql; // end of the whole range, caps the last bucket
}

const ranges: Readonly<Record<Period, Range>> = {
  Today: {
    from: today,
    to: Prisma.sql`DATE_TRUNC('hour', ${now})`,
    step: Prisma.sql`INTERVAL '1 hour'`,
    until: Prisma.sql`${today} + INTERVAL '1 day'`,
  },
  Week: {
    from: Prisma.sql`${today} - INTERVAL '6 days'`,
    to: today,
    step: Prisma.sql`INTERVAL '1 day'`,
    until: Prisma.sql`${today} + INTERVAL '1 day'`,
  },
  // 7-day buckets from the 1st, the last one capped at the end of the month
  Month: {
    from: thisMonth,
    to: now,
    step: Prisma.sql`INTERVAL '7 days'`,
    until: Prisma.sql`${thisMonth} + INTERVAL '1 month'`,
  },
  Year: {
    from: Prisma.sql`${thisMonth} - INTERVAL '11 months'`,
    to: thisMonth,
    step: Prisma.sql`INTERVAL '1 month'`,
    until: Prisma.sql`${thisMonth} + INTERVAL '1 month'`,
  },
};

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  getSalesOverview(period: Period): Promise<readonly SalesPoint[]> {
    return this.completedSalesBy(ranges[period]).then(toSalesPoints(period));
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
        SELECT ("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${tz} AS at,
               "totalAmount"
        FROM "Transaction"
        WHERE status = 'COMPLETED'
      )
      SELECT b.start AT TIME ZONE ${tz} AS bucket,
             COALESCE(SUM(s."totalAmount"), 0) AS total
      FROM buckets b
      LEFT JOIN sales s ON s.at >= b.start AND s.at < b."end"
      GROUP BY b.start
      ORDER BY b.start
    `;
  }
}
