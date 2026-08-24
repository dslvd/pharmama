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
    const list = await this.prisma.stock.findMany();

    const sortBy = filter.sortBy ?? "createdAt";
    const order = filter.order ?? "desc";

    return [...list].sort((a, b) => {
      const aVal = sortBy === "quantity" ? a.quantity : a[sortBy].getTime();
      const bVal = sortBy === "quantity" ? b.quantity : b[sortBy].getTime();
      return order === "asc" ? aVal - bVal : bVal - aVal;
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
    const list = await this.prisma.stock.findMany({
      include: { product: true },
    });

    if (!query) {
      return list;
    }

    const q = query.toLowerCase();

    return list.filter(
      (stock) =>
        stock.batchNumber.toLowerCase().includes(q) ||
        stock.product.name.toLowerCase().includes(q),
    );
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
