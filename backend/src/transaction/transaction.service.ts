import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  AuditAction,
  AuditEntity,
  Prisma,
  Transaction,
  TransactionItem,
  TransactionStatus,
} from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateTransactionDto,
  TransactionItemDto,
  validateCancellable,
  validateStock,
  validateTransactionExists,
} from "./validation";
import { createAuditLog } from "src/audit-log/audit-log.util";

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getTransaction(id: number): Promise<
    Prisma.TransactionGetPayload<{
      include: { transactionItems: true };
    }>
  > {
    const found = await this.prisma.transaction.findUnique({
      where: { id },
      include: { transactionItems: true },
    });

    const result = validateTransactionExists(found);
    if (!result.ok) {
      throw new NotFoundException(result.error);
    }

    return result.value;
  }

  async getTransactionList(filter: {
    status?: TransactionStatus;
    handledBy?: string;
    order?: Prisma.SortOrder;
  }): Promise<Transaction[]> {
    const list = await this.prisma.transaction.findMany();

    const filtered = list.filter((tx) => {
      const statusMatch = !filter.status || tx.status === filter.status;
      const handledByMatch =
        !filter.handledBy ||
        tx.handledBy
          .toLowerCase()
          .includes(filter.handledBy.toLowerCase().trim());

      return statusMatch && handledByMatch;
    });

    return [...filtered].sort((a, b) =>
      (filter.order ?? "desc") === "asc"
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      await Promise.all(
        data.transactionItems.map(async (item) => {
          const stock = await tx.stock.findUnique({
            where: { id: item.stockId },
            select: { quantity: true },
          });

          const stockResult = validateStock(stock, item.quantity);
          if (!stockResult.ok) {
            throw new BadRequestException(stockResult.error);
          }

          const updated = await tx.stock.updateMany({
            where: {
              id: item.stockId,
              quantity: { gte: item.quantity },
            },
            data: {
              quantity: { decrement: item.quantity },
            },
          });

          if (updated.count !== 1) {
            throw new BadRequestException(
              `Could not reserve stock ${item.stockId}`,
            );
          }
        }),
      );

      const totalAmount = getTotalAmount(data.transactionItems);
      const transaction = await tx.transaction.create({
        data: {
          totalAmount,
          status: data.status,
          handledBy: data.handledBy.toUpperCase().trim(),
          transactionItems: {
            create: data.transactionItems.map((item) => ({
              productId: item.productId,
              stockId: item.stockId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.unitPrice * item.quantity,
            })),
          },
        },
      });

      await createAuditLog(tx, {
        entity: AuditEntity.TRANSACTION,
        entityId: transaction.id,
        action: AuditAction.CREATE,
      });

      return transaction;
    });
  }

  async cancelTransaction(id: number): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          transactionItems: true,
        },
      });

      const result = validateTransactionExists(existing);
      if (!result.ok) {
        throw new NotFoundException(result.error);
      }

      const transaction = result.value;

      const check = validateCancellable(transaction);
      if (!check.ok) {
        throw new BadRequestException(check.error);
      }

      await Promise.all(
        transaction.transactionItems.map((item) =>
          tx.stock.update({
            where: { id: item.stockId },
            data: { quantity: { increment: item.quantity } },
          }),
        ),
      );

      const updated = await tx.transaction.update({
        where: { id },
        data: { status: TransactionStatus.CANCELLED },
      });

      await createAuditLog(tx, {
        entity: AuditEntity.TRANSACTION,
        entityId: id,
        action: AuditAction.CANCEL,
        changes: {
          old: { status: transaction.status },
          new: { status: updated.status },
        },
      });

      return updated;
    });
  }

  async searchTransaction(query: string): Promise<Transaction[]> {
    const list = await this.prisma.transaction.findMany();

    if (!query) {
      return list;
    }

    const q = query.toLowerCase();
    const statusMatch = Object.values(TransactionStatus).includes(
      query.toUpperCase() as TransactionStatus,
    )
      ? (query.toUpperCase() as TransactionStatus)
      : undefined;

    return list.filter(
      (tx) =>
        tx.handledBy.toLowerCase().includes(q) ||
        (statusMatch ? tx.status === statusMatch : false),
    );
  }
}

function getTotalAmount(items: TransactionItemDto[]) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}
