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
  TransactionStatus,
} from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateTransactionDto,
  TransactionWithItems,
  UpdateTransactionStatusDto,
  validateCancellable,
  validateStatusUpdatable,
  validateStock,
  validateTransactionExists,
} from "./transaction.validation";
import { createAuditLog } from "src/util/audit-log.util";
import { safeUserSelect } from "src/users/users.select";

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getTransactionList(): Promise<TransactionWithItems[]> {
    return await this.prisma.transaction.findMany({
      include: {
        transactionItems: { include: { product: true } },
        user: { select: safeUserSelect },
      },
    });
  }

  async createTransaction(
    data: CreateTransactionDto,
    handledBy: number,
  ): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      const lineItems: Prisma.TransactionItemCreateManyTransactionInput[] = [];

      // sequential on purpose: queries on one interactive transaction
      // can't run in parallel, and duplicate stockIds must see prior decrements
      for (const item of data.transactionItems) {
        const stock = await tx.stock.findUnique({
          where: { id: item.stockId },
          select: {
            quantity: true,
            expiryDate: true,
            batchNumber: true,
            productId: true,
            product: true,
          },
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
            `Stock for batch ${stock!.batchNumber} changed during checkout. Please try again.`,
          );
        }

        // price always comes from the product, never from the client
        const unitPrice = stock!.product.price;
        lineItems.push({
          productId: stock!.productId,
          stockId: item.stockId,
          quantity: item.quantity,
          unitPrice,
          subtotal: unitPrice.mul(item.quantity),
        });
      }

      const totalAmount = lineItems.reduce(
        (sum, item) => sum.add(item.subtotal as Prisma.Decimal),
        new Prisma.Decimal(0),
      );
      const transaction = await tx.transaction.create({
        data: {
          totalAmount,
          status: TransactionStatus.COMPLETED,
          handledBy,
          transactionItems: { createMany: { data: lineItems } },
        },
      });

      await createAuditLog(tx, {
        user: handledBy,
        entity: AuditEntity.TRANSACTION,
        entityId: transaction.id,
        action: AuditAction.CREATE,
      });

      return transaction;
    });
  }

  async cancelTransaction(id: number, handledBy: number): Promise<Transaction> {
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

      for (const item of transaction.transactionItems) {
        await tx.stock.update({
          where: { id: item.stockId },
          data: { quantity: { increment: item.quantity } },
        });
      }

      const updated = await tx.transaction.update({
        where: { id },
        data: { status: TransactionStatus.CANCELLED },
      });

      await createAuditLog(tx, {
        user: handledBy,
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

  async updateTransactionStatus(
    id: number,
    dto: UpdateTransactionStatusDto,
    handledBy: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({
        where: { id },
        select: { id: true, status: true, transactionItems: true },
      });

      const result = validateTransactionExists(existing);
      if (!result.ok) throw new NotFoundException(result.error);

      const transaction = result.value;

      const check = validateStatusUpdatable(transaction, dto.status);
      if (!check.ok) throw new BadRequestException(check.error);

      for (const item of transaction.transactionItems) {
        await tx.stock.update({
          where: { id: item.stockId },
          data: { quantity: { increment: item.quantity } },
        });
      }

      const updated = await tx.transaction.update({
        where: { id },
        data: { status: dto.status },
      });

      await createAuditLog(tx, {
        user: handledBy,
        entity: AuditEntity.TRANSACTION,
        entityId: id,
        action:
          dto.status === "CANCELLED" ? AuditAction.CANCEL : AuditAction.UPDATE,
        changes: {
          old: { status: transaction.status },
          new: { status: updated.status },
        },
      });

      return updated;
    });
  }
}
