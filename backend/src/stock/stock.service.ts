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
} from "./stock.validation";
import { createAuditLog } from "src/util/audit-log.util";

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getStockList(): Promise<Stock[]> {
    return await this.prisma.stock.findMany();
  }

  async createStock(data: CreateStockDto, handledBy: number): Promise<Stock> {
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
        user: handledBy,
        entity: AuditEntity.STOCK,
        entityId: stock.id,
        action: AuditAction.CREATE,
      });

      return stock;
    });
  }

  async updateStock(
    id: number,
    body: UpdateStockDto,
    handledBy: number,
  ): Promise<Stock> {
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
        user: handledBy,
        entity: AuditEntity.STOCK,
        entityId: id,
        action: AuditAction.UPDATE,
        changes: changes,
      });

      return updated;
    });
  }

  async deleteStock(id: number, handledBy: number): Promise<Stock> {
    return this.prisma.$transaction(async (st) => {
      const found = await st.stock.findUnique({ where: { id } });
      const result = validateStockExist(found);
      if (!result.ok) {
        throw new NotFoundException(result.error);
      }

      await createAuditLog(st, {
        user: handledBy,
        entity: AuditEntity.STOCK,
        entityId: id,
        action: AuditAction.DELETE,
      });

      return st.stock.delete({
        where: { id },
      });
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
