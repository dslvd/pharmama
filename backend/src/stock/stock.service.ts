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
  notFound,
  runInTransaction,
} from "src/util/domain-error.util";
import {
  andThen,
  andThenAsync,
  AsyncResult,
  fromNullable,
  map,
  ok,
  tapAsync,
} from "src/util/results.util";

type Tx = Prisma.TransactionClient;

// ---- effects ---------------------------------------------------------------

const loadStock = (tx: Tx, id: number) =>
  tx.stock
    .findUnique({ where: { id } })
    .then(fromNullable(notFound("Stock not found.")));

const ensureProductExists =
  (tx: Tx) =>
  <T extends Partial<StockData>>(data: T): AsyncResult<T, DomainError> =>
    data.productId === undefined
      ? Promise.resolve(ok(data))
      : tx.product
          .findUnique({ where: { id: data.productId }, select: { id: true } })
          .then(fromNullable(notFound("Product not found.")))
          .then(map(() => data));

// the (productId, batchNumber) pair must be unique
const ensureBatchFree =
  (tx: Tx, selfId?: number) =>
  (data: StockData): AsyncResult<StockData, DomainError> =>
    tx.stock
      .findUnique({
        where: {
          productId_batchNumber: {
            productId: data.productId,
            batchNumber: data.batchNumber,
          },
        },
        select: { id: true },
      })
      .then((found) =>
        map(() => data)(ensureBatchIsNew(data.batchNumber, found?.id, selfId)),
      );

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

// ---- service ---------------------------------------------------------------

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  getStockList(): Promise<StockWithProduct[]> {
    return this.prisma.stock.findMany({ include: { product: true } });
  }

  createStock(
    data: CreateStockDto,
    handledBy: number,
    now: Date = new Date(),
  ): AsyncResult<Stock, DomainError> {
    return runInTransaction(this.prisma, (tx) =>
      Promise.resolve(toStockData(now)(data))
        .then(andThenAsync(ensureProductExists(tx)))
        .then(andThenAsync(ensureBatchFree(tx)))
        .then(
          andThenAsync((valid) =>
            tx.stock
              .create({ data: valid })
              .then(
                tapAsync((stock) =>
                  audit(tx, handledBy, stock.id, AuditAction.CREATE),
                ),
              ),
          ),
        ),
    );
  }

  updateStock(
    id: number,
    body: UpdateStockDto,
    handledBy: number,
    now: Date = new Date(),
  ): AsyncResult<Stock, DomainError> {
    return runInTransaction(this.prisma, (tx) =>
      loadStock(tx, id)
        .then(
          andThen((existing) =>
            map((patch: Partial<StockData>) => ({ existing, patch }))(
              toStockPatch(now)(body),
            ),
          ),
        )
        .then(
          andThenAsync(({ existing, patch }) =>
            ensureProductExists(tx)({ ...existing, ...patch })
              .then(andThenAsync(ensureBatchFree(tx, id)))
              .then(map(() => ({ existing, patch }))),
          ),
        )
        .then(
          andThenAsync(({ existing, patch }) =>
            tx.stock
              .update({ where: { id }, data: patch })
              .then(
                tapAsync((updated) =>
                  audit(
                    tx,
                    handledBy,
                    id,
                    AuditAction.UPDATE,
                    diffFields(Object.keys(body) as (keyof StockData)[])(
                      existing,
                      updated,
                    ),
                  ),
                ),
              ),
          ),
        ),
    );
  }

  deleteStock(id: number, handledBy: number): AsyncResult<Stock, DomainError> {
    return runInTransaction(this.prisma, (tx) =>
      loadStock(tx, id)
        .then(
          andThenAsync((existing) =>
            tx.transactionItem
              .count({ where: { stockId: id } })
              .then(ensureDeletable)
              .then(map(() => existing)),
          ),
        )
        .then(
          andThenAsync(
            tapAsync(() => audit(tx, handledBy, id, AuditAction.DELETE)),
          ),
        )
        .then(
          andThenAsync((existing) =>
            tx.stock.delete({ where: { id: existing.id } }).then(ok),
          ),
        ),
    );
  }
}
