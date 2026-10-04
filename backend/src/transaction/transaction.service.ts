import { Injectable } from "@nestjs/common";
import {
  AuditEntity,
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
  restockPlan,
  priceItems,
  totalOf,
  transitionStatus,
} from "./transaction.domain";
import { createAuditLog } from "src/util/audit-log.util";
import { safeUserSelect } from "src/users/users.select";
import {
  conflict,
  DomainError,
  DomainException,
  notFound,
} from "src/util/domain-error.util";
import { AsyncResult, err, ok } from "src/util/results.util";

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

  async createTransaction(
    data: CreateTransactionDto,
    handledBy: number,
    now: Date = new Date(),
  ): AsyncResult<Transaction, DomainError> {
    try {
      const transaction = await this.prisma.$transaction(async (tx) => {
        const stocks = await tx.stock.findMany({
          where: { id: { in: data.transactionItems.map((i) => i.stockId) } },
          select: {
            id: true,
            quantity: true,
            expiryDate: true,
            batchNumber: true,
            productId: true,
            product: { select: { name: true, price: true } },
          },
        });

        const lines = priceItems(now)(stocks, data.transactionItems);
        if (!lines.ok) throw new DomainException(lines.error);

        // conditional decrement guards against a concurrent sale taking the stock
        for (const line of lines.value) {
          const { count } = await tx.stock.updateMany({
            where: { id: line.stockId, quantity: { gte: line.quantity } },
            data: { quantity: { decrement: line.quantity } },
          });
          if (count !== 1) {
            throw new DomainException(
              conflict("Stock changed during checkout. Please try again."),
            );
          }
        }

        const created = await tx.transaction.create({
          data: {
            totalAmount: totalOf(lines.value),
            status: TransactionStatus.COMPLETED,
            handledBy,
            transactionItems: { createMany: { data: [...lines.value] } },
          },
        });
        await createAuditLog(tx, {
          user: handledBy,
          entity: AuditEntity.TRANSACTION,
          entityId: created.id,
          action: AuditAction.CREATE,
        });
        return created;
      });
      return ok(transaction);
    } catch (e) {
      if (e instanceof DomainException) return err(e.error);
      throw e;
    }
  }

  updateTransactionStatus(
    id: number,
    to: TransactionStatus,
    handledBy: number,
  ): AsyncResult<Transaction, DomainError> {
    return this.changeStatus(id, to, handledBy);
  }

  // cancel/refund: validate the transition, put stock back, record it
  private async changeStatus(
    id: number,
    to: TransactionStatus,
    handledBy: number,
  ): AsyncResult<Transaction, DomainError> {
    try {
      const transaction = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.transaction.findUnique({
          where: { id },
          select: { id: true, status: true, transactionItems: true },
        });
        if (!existing) {
          throw new DomainException(notFound("Transaction not found."));
        }

        const status = transitionStatus(existing.status, to);
        if (!status.ok) throw new DomainException(status.error);

        // only flips if it's still COMPLETED, so two requests at once
        // can't both restock the same sale
        const { count } = await tx.transaction.updateMany({
          where: { id, status: TransactionStatus.COMPLETED },
          data: { status: status.value },
        });
        if (count !== 1) {
          const current = await tx.transaction.findUniqueOrThrow({
            where: { id },
            select: { status: true },
          });
          const retry = transitionStatus(current.status, to);
          throw new DomainException(
            retry.ok
              ? conflict("Transaction changed. Please try again.")
              : retry.error,
          );
        }

        for (const item of restockPlan(existing.transactionItems)) {
          await tx.stock.update({
            where: { id: item.stockId },
            data: { quantity: { increment: item.quantity } },
          });
        }

        const updated = await tx.transaction.findUniqueOrThrow({
          where: { id },
        });
        await createAuditLog(tx, {
          user: handledBy,
          entity: AuditEntity.TRANSACTION,
          entityId: id,
          action: auditActionFor(status.value),
          changes: {
            old: { status: existing.status },
            new: { status: updated.status },
          },
        });
        return updated;
      });
      return ok(transaction);
    } catch (e) {
      if (e instanceof DomainException) return err(e.error);
      throw e;
    }
  }
}
