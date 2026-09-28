// sales.service.ts
import { Injectable } from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { Period, SalesPoint } from "./sales.validation";
import { Bucket, bucketFor, SalesRow, toSalesPoints } from "./sales.domain";

// start of each period's range, evaluated in the database's timezone
const rangeStart: Readonly<Record<Period, Prisma.Sql>> = {
  Today: Prisma.sql`CURRENT_DATE`,
  Week: Prisma.sql`CURRENT_DATE - INTERVAL '6 days'`,
  Month: Prisma.sql`DATE_TRUNC('month', CURRENT_DATE)`,
  Year: Prisma.sql`DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months'`,
};

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  getSalesOverview(period: Period): Promise<readonly SalesPoint[]> {
    return this.completedSalesBy(bucketFor[period], rangeStart[period]).then(
      toSalesPoints(period),
    );
  }

  // bucket comes from the fixed bucketFor map, never from user input
  private completedSalesBy(bucket: Bucket, since: Prisma.Sql) {
    return this.prisma.$queryRaw<SalesRow[]>`
      SELECT DATE_TRUNC(${Prisma.raw(`'${bucket}'`)}, "createdAt") AS bucket,
             SUM("totalAmount") AS total
      FROM "Transaction"
      WHERE "createdAt" >= ${since}
        AND status = 'COMPLETED'
      GROUP BY bucket
      ORDER BY bucket
    `;
  }
}
