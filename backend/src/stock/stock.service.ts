import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  AuditAction,
  AuditEntity,
  Prisma,
  Stock,
} from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateStockDto,
  UpdateStockDto,
  validateExpiryDate,
  validateStockExist,
} from "./validation";
import { createAuditLog } from "src/audit-log/audit-log.util";

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getStock(
    id: number,
  ): Promise<Prisma.StockGetPayload<{ include: { product: true } }>> {
    const found = await this.prisma.stock.findUnique({
      where: { id },
      include: { product: true },
    });

    const result = validateStockExist(found);
    if (!result.ok) {
      throw new NotFoundException(result.error);
    }

    return result.value;
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
      const result = validateExpiryDate(data.expiryDate);
      if (!result.ok) {
        throw new BadRequestException(result.error);
      }

      const stock = await st.stock.create({
        data: {
          ...data,
          expiryDate: result.value,
        },
      });

      await createAuditLog(st, {
        entity: AuditEntity.STOCK,
        entityId: stock.id,
        action: AuditAction.CREATE,
      });

      return stock;
    });
  }

  async updateStock(id: number, body: UpdateStockDto): Promise<Stock> {
    return this.prisma.$transaction(async (st) => {
      const found = await st.stock.findUnique({ where: { id } });
      const result = validateStockExist(found);
      if (!result.ok) {
        throw new NotFoundException(result.error);
      }

      let expiryDate: Date | undefined;
      if (body.expiryDate) {
        const dateResult = validateExpiryDate(body.expiryDate);
        if (!dateResult.ok) {
          throw new BadRequestException(dateResult.error);
        }
        expiryDate = dateResult.value;
      }

      const updated = await st.stock.update({
        where: { id },
        data: {
          ...body,
          ...(expiryDate && { expiryDate }),
        },
      });

      const changedKeys = Object.keys(body) as (keyof UpdateStockDto)[];
      const changes = getChangedFields(result.value, updated, changedKeys);

      await createAuditLog(st, {
        entity: AuditEntity.STOCK,
        entityId: id,
        action: AuditAction.UPDATE,
        changes: changes,
      });

      return updated;
    });
  }

  async deleteStock(id: number): Promise<Stock> {
    return this.prisma.$transaction(async (st) => {
      const found = await st.stock.findUnique({ where: { id } });
      const result = validateStockExist(found);
      if (!result.ok) {
        throw new NotFoundException(result.error);
      }

      await createAuditLog(st, {
        entity: AuditEntity.STOCK,
        entityId: id,
        action: AuditAction.DELETE,
      });

      return st.stock.delete({
        where: { id },
      });
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

function getChangedFields(
  existing: Stock,
  updated: Stock,
  changedKeys: (keyof UpdateStockDto)[],
): { old: Record<string, unknown>; new: Record<string, unknown> } {
  return {
    old: Object.fromEntries(changedKeys.map((key) => [key, existing[key]])),
    new: Object.fromEntries(changedKeys.map((key) => [key, updated[key]])),
  };
}
