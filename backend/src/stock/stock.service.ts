import { Injectable, NotFoundException } from "@nestjs/common";
import {
  AuditAction,
  AuditEntity,
  Prisma,
  Stock,
} from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateStockDto, validateStockExist } from "./validation";

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getStock(
    id: number,
  ): Promise<Prisma.StockGetPayload<{ include: { product: true } }>> {
    return this.prisma.$transaction(async (st) => {
      const found = await st.stock.findUnique({
        where: { id },
        include: { product: true },
      });

      const result = validateStockExist(found);
      if (!result.ok) {
        throw new NotFoundException(result.error);
      }

      return result.value;
    });
  }

  async getStockList(filter: {
    sortBy?: "quantity" | "expiryDate" | "createdAt";
    order?: Prisma.SortOrder;
  }): Promise<Stock[]> {
    return this.prisma.stock.findMany({
      orderBy: { [filter.sortBy ?? "createdAt"]: filter.order ?? "desc" },
    });
  }

  async createStock(data: CreateStockDto): Promise<Stock> {
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
