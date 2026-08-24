// sales.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Period, SalesPoint } from "./validation";

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async getSalesOverview(period: Period): Promise<SalesPoint[]> {
    switch (period) {
      case "Today":
        return this.getToday();
      case "Week":
        return this.getWeek();
      case "Month":
        return this.getMonth();
      case "Year":
        return this.getYear();
    }
  }

  private async getToday(): Promise<SalesPoint[]> {
    const rows = await this.prisma.$queryRaw<{ hour: Date; total: number }[]>`
            SELECT DATE_TRUNC('hour', "createdAt") AS hour, SUM(total) AS total
            FROM "Transaction"
            WHERE "createdAt" >= CURRENT_DATE
              AND status = 'COMPLETED'
            GROUP BY hour
            ORDER BY hour
        `;
    return rows.map((r) => ({
      label: new Date(r.hour).toLocaleTimeString("en-US", { hour: "numeric" }),
      value: Number(r.total),
    }));
  }

  private async getWeek(): Promise<SalesPoint[]> {
    const rows = await this.prisma.$queryRaw<{ day: Date; total: number }[]>`
            SELECT DATE_TRUNC('day', "createdAt") AS day, SUM(total) AS total
            FROM "Transaction"
            WHERE "createdAt" >= CURRENT_DATE - INTERVAL '6 days'
              AND status = 'COMPLETED'
            GROUP BY day
            ORDER BY day
        `;
    return rows.map((r) => ({
      label: new Date(r.day).toLocaleDateString("en-US", { weekday: "short" }),
      value: Number(r.total),
    }));
  }

  private async getMonth(): Promise<SalesPoint[]> {
    const rows = await this.prisma.$queryRaw<{ week: Date; total: number }[]>`
            SELECT DATE_TRUNC('week', "createdAt") AS week, SUM(total) AS total
            FROM "Transaction"
            WHERE "createdAt" >= DATE_TRUNC('month', CURRENT_DATE)
              AND status = 'COMPLETED'
            GROUP BY week
            ORDER BY week
        `;
    return rows.map((r, i) => ({
      label: `Wk ${i + 1}`,
      value: Number(r.total),
    }));
  }

  private async getYear(): Promise<SalesPoint[]> {
    const rows = await this.prisma.$queryRaw<{ month: Date; total: number }[]>`
            SELECT DATE_TRUNC('month', "createdAt") AS month, SUM(total) AS total
            FROM "Transaction"
            WHERE "createdAt" >= CURRENT_DATE - INTERVAL '6 months'
              AND status = 'COMPLETED'
            GROUP BY month
            ORDER BY month
        `;
    return rows.map((r) => ({
      label: new Date(r.month).toLocaleDateString("en-US", { month: "short" }),
      value: Number(r.total),
    }));
  }
}
