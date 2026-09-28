import { Injectable } from "@nestjs/common";
import {
  AuditEntity,
  Prisma,
  Transaction,
  TransactionStatus,
} from "src/generated/prisma/client";
import { AuditAction } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateTransactionDto,
  TransactionWithItems,
} from "./transaction.validation";
import {
  auditActionFor,
  ItemInput,
  LineItem,
  priceItems,
  restockPlan,
  totalOf,
  transitionStatus,
} from "./transaction.domain";
import { createAuditLog } from "src/util/audit-log.util";
import { safeUserSelect } from "src/users/users.select";
import {
  conflict,
  DomainError,
  notFound,
  runInTransaction,
} from "src/util/domain-error.util";
import {
  andThen,
  andThenAsync,
  AsyncResult,
  err,
  fromNullable,
  map,
  ok,
  traverseAsync,
} from "src/util/results.util";

type Tx = Prisma.TransactionClient;

// ---- effects: small single-purpose DB steps -------------------------------

const loadStocks = (tx: Tx, items: readonly ItemInput[]) =>
  tx.stock.findMany({
    where: { id: { in: items.map((i) => i.stockId) } },
    select: {
      id: true,
      quantity: true,
      expiryDate: true,
      batchNumber: true,
      productId: true,
      product: { select: { name: true, price: true } },
    },
  });

// conditional decrement guards against a concurrent sale taking the stock
const reserveLine =
  (tx: Tx) =>
  async (line: LineItem): AsyncResult<LineItem, DomainError> => {
    const { count } = await tx.stock.updateMany({
      where: { id: line.stockId, quantity: { gte: line.quantity } },
      data: { quantity: { decrement: line.quantity } },
    });
    return count === 1
      ? ok(line)
      : err(conflict("Stock changed during checkout. Please try again."));
  };

const restock =
  (tx: Tx) =>
  async (item: ItemInput): AsyncResult<ItemInput, DomainError> => {
    await tx.stock.update({
      where: { id: item.stockId },
      data: { quantity: { increment: item.quantity } },
    });
    return ok(item);
  };

const insertTransaction =
  (tx: Tx, handledBy: number) =>
  (lines: readonly LineItem[]): Promise<Transaction> =>
    tx.transaction.create({
      data: {
        totalAmount: totalOf(lines),
        status: TransactionStatus.COMPLETED,
        handledBy,
        transactionItems: { createMany: { data: [...lines] } },
      },
    });

const loadTransaction = (tx: Tx, id: number) =>
  tx.transaction
    .findUnique({
      where: { id },
      select: { id: true, status: true, transactionItems: true },
    })
    .then(fromNullable(notFound("Transaction not found.")));

// ---- service: pipelines of pure steps and effects --------------------------

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  getTransactionList(): Promise<TransactionWithItems[]> {
    return this.prisma.transaction.findMany({
      include: {
        transactionItems: { include: { product: true } },
        user: { select: safeUserSelect },
      },
    });
  }

  createTransaction(
    data: CreateTransactionDto,
    handledBy: number,
    now: Date = new Date(),
  ): AsyncResult<Transaction, DomainError> {
    return runInTransaction(this.prisma, (tx) =>
      loadStocks(tx, data.transactionItems)
        .then((stocks) => priceItems(now)(stocks, data.transactionItems))
        .then(andThenAsync(traverseAsync(reserveLine(tx))))
        .then(
          andThenAsync(async (lines) => {
            const transaction = await insertTransaction(tx, handledBy)(lines);
            await createAuditLog(tx, {
              user: handledBy,
              entity: AuditEntity.TRANSACTION,
              entityId: transaction.id,
              action: AuditAction.CREATE,
            });
            return ok(transaction);
          }),
        ),
    );
  }

  cancelTransaction(
    id: number,
    handledBy: number,
  ): AsyncResult<Transaction, DomainError> {
    return this.changeStatus(id, TransactionStatus.CANCELLED, handledBy);
  }

  updateTransactionStatus(
    id: number,
    to: TransactionStatus,
    handledBy: number,
  ): AsyncResult<Transaction, DomainError> {
    return this.changeStatus(id, to, handledBy);
  }

  // cancel/refund: validate the transition, put stock back, record it
  private changeStatus(
    id: number,
    to: TransactionStatus,
    handledBy: number,
  ): AsyncResult<Transaction, DomainError> {
    return runInTransaction(this.prisma, (tx) =>
      loadTransaction(tx, id)
        .then(
          andThen((existing) =>
            map((status: TransactionStatus) => ({ existing, status }))(
              transitionStatus(existing.status, to),
            ),
          ),
        )
        .then(
          andThenAsync(({ existing, status }) =>
            traverseAsync(restock(tx))(
              restockPlan(existing.transactionItems),
            ).then(
              andThenAsync(async () => {
                const updated = await tx.transaction.update({
                  where: { id },
                  data: { status },
                });
                await createAuditLog(tx, {
                  user: handledBy,
                  entity: AuditEntity.TRANSACTION,
                  entityId: id,
                  action: auditActionFor(status),
                  changes: {
                    old: { status: existing.status },
                    new: { status: updated.status },
                  },
                });
                return ok(updated);
              }),
            ),
          ),
        ),
    );
  }
}
