import { Injectable } from "@nestjs/common";
import {
  AuditAction,
  AuditEntity,
  Prisma,
  Stock,
} from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateStockDto,
  StockWithProduct,
  UpdateStockDto,
} from "./stock.validation";
import {
  ensureBatchIsNew,
  ensureDeletable,
  StockData,
  toStockData,
  toStockPatch,
} from "./stock.domain";
import { createAuditLog } from "src/util/audit-log.util";
import { diffFields } from "src/util/audit-diff.util";
import {
  DomainError,
  DomainException,
  notFound,
} from "src/util/domain-error.util";
import { AsyncResult, err, ok } from "src/util/results.util";

type Tx = Prisma.TransactionClient;

const ensureProductExists = async (tx: Tx, productId: number) => {
  const product = await tx.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) throw new DomainException(notFound("Product not found."));
};

// the (productId, batchNumber) pair must be unique
const ensureBatchFree = async (tx: Tx, data: StockData, selfId?: number) => {
  const found = await tx.stock.findUnique({
    where: {
      productId_batchNumber: {
        productId: data.productId,
        batchNumber: data.batchNumber,
      },
    },
    select: { id: true },
  });
  const isNew = ensureBatchIsNew(data.batchNumber, found?.id, selfId);
  if (!isNew.ok) throw new DomainException(isNew.error);
};

const audit = (
  tx: Tx,
  user: number,
  entityId: number,
  action: AuditAction,
  changes?: { old: unknown; new: unknown },
) =>
  createAuditLog(tx, {
    user,
    entity: AuditEntity.STOCK,
    entityId,
    action,
    changes,
  });

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  getStockList(): Promise<StockWithProduct[]> {
    return this.prisma.stock.findMany({ include: { product: true } });
  }

  async createStock(
    data: CreateStockDto,
    handledBy: number,
    now: Date = new Date(),
  ): AsyncResult<Stock, DomainError> {
    const valid = toStockData(now)(data);
    if (!valid.ok) return valid;

    try {
      const stock = await this.prisma.$transaction(async (tx) => {
        await ensureProductExists(tx, valid.value.productId);
        await ensureBatchFree(tx, valid.value);

        const created = await tx.stock.create({ data: valid.value });
        await audit(tx, handledBy, created.id, AuditAction.CREATE);
        return created;
      });
      return ok(stock);
    } catch (e) {
      if (e instanceof DomainException) return err(e.error);
      throw e;
    }
  }

  async updateStock(
    id: number,
    body: UpdateStockDto,
    handledBy: number,
    now: Date = new Date(),
  ): AsyncResult<Stock, DomainError> {
    const patch = toStockPatch(now)(body);
    if (!patch.ok) return patch;

    try {
      const stock = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.stock.findUnique({ where: { id } });
        if (!existing) throw new DomainException(notFound("Stock not found."));

        const merged = { ...existing, ...patch.value };
        await ensureProductExists(tx, merged.productId);
        await ensureBatchFree(tx, merged, id);

        const updated = await tx.stock.update({
          where: { id },
          data: patch.value,
        });
        const changedKeys = Object.keys(body) as (keyof StockData)[];
        await audit(
          tx,
          handledBy,
          id,
          AuditAction.UPDATE,
          diffFields(changedKeys)(existing, updated),
        );
        return updated;
      });
      return ok(stock);
    } catch (e) {
      if (e instanceof DomainException) return err(e.error);
      throw e;
    }
  }

  async deleteStock(
    id: number,
    handledBy: number,
  ): AsyncResult<Stock, DomainError> {
    try {
      const stock = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.stock.findUnique({ where: { id } });
        if (!existing) throw new DomainException(notFound("Stock not found."));

        const soldCount = await tx.transactionItem.count({
          where: { stockId: id },
        });
        const deletable = ensureDeletable(soldCount);
        if (!deletable.ok) throw new DomainException(deletable.error);

        await audit(tx, handledBy, id, AuditAction.DELETE);
        return tx.stock.delete({ where: { id } });
      });
      return ok(stock);
    } catch (e) {
      if (e instanceof DomainException) return err(e.error);
      throw e;
    }
  }
}
