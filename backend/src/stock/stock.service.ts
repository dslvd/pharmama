import { Injectable } from "@nestjs/common";
import {
  AuditAction,
  AuditEntity,
  Prisma,
  Stock,
} from "src/generated/prisma/client";
import { StockCreateInput } from "src/generated/prisma/models";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getStock(
    id: number,
  ): Promise<Prisma.StockGetPayload<{ include: { product: true } }> | null> {
    return this.prisma.stock.findUnique({
      where: { id },
      include: { product: true },
    });
  }

  async getStockList(filter: {
    quantity?: Prisma.SortOrder;
    expiryDate?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
  }): Promise<Stock[]> {
    return this.prisma.stock.findMany({
      orderBy: {
        quantity: filter.quantity ?? "desc",
        expiryDate: filter.expiryDate ?? "desc",
        createdAt: filter.order ?? "desc",
      },
    });
  }

  async createStock(data: StockCreateInput): Promise<Stock> {
    return this.prisma.$transaction(async (st) => {
      const stock = await st.stock.create({
        data: {
          ...data,
          expiryDate: new Date(data.expiryDate),
        },
      });

      await st.auditLog.create({
        data: {
          entity: AuditEntity.STOCK,
          entityId: stock.id,
          action: AuditAction.CREATE,
        },
      });

      return stock;
    });
  }

  async searchStock(query: string): Promise<Stock[]> {
    return this.prisma.stock.findMany({
      where: query
        ? {
            OR: [
              { batchNumber: { contains: query, mode: "insensitive" } },
              { product: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {},
    });
  }
}
