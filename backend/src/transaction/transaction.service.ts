import { Injectable } from "@nestjs/common";
import {
  AuditAction,
  AuditEntity,
  Prisma,
  Transaction,
  TransactionStatus,
} from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getTransaction(id: number): Promise<Prisma.TransactionGetPayload<{
    include: { transactionItems: true };
  }> | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: { transactionItems: true },
    });
  }

  async getTransactionList(filter: {
    status?: TransactionStatus;
    handledBy?: string;
    order?: Prisma.SortOrder;
  }): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        ...(filter.status && { status: filter.status }),
        ...(filter.handledBy && {
          handledBy: {
            contains: filter.handledBy.toUpperCase().trim(),
            mode: "insensitive",
          },
        }),
      },
      orderBy: { createdAt: filter.order ?? "desc" },
    });
  }

  async getTodaySales(): Promise<{ total: number; date: string }> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const total = await this.prisma.transaction.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    return {
      total: total._sum.totalAmount ?? 0,
      date: startOfDay.toISOString().split("T")[0],
    };
  }

  async createTransaction(data: CreateTransactionInput): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      for (const item of data.transactionItems) {
        const stock = await tx.stock.findUnique({
          where: { id: item.stockId },
        });

        if (!stock) {
          throw new Error(`Stock ${item.stockId} not found`);
        } else if (stock.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for item ${item.stockId}: have ${stock.quantity}, need ${item.quantity}`,
          );
        }
      }

      const totalAmount = data.transactionItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );

      const transaction = await tx.transaction.create({
        data: {
          totalAmount: totalAmount,
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

      for (const item of data.transactionItems) {
        await tx.stock.update({
          where: { id: item.stockId },
          data: {
            quantity: { decrement: item.quantity },
          },
        });
      }

      await tx.auditLog.create({
        data: {
          entity: AuditEntity.TRANSACTION,
          entityId: transaction.id,
          action: AuditAction.CREATE,
        },
      });

      return transaction;
    });
  }

  async cancelTransaction(id: number): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({
        where: { id },
        select: {
          status: true,
          transactionItems: true,
        },
      });

      if (!existing) {
        throw new Error(`Transaction ${id} not found`);
      }

      for (const item of existing.transactionItems) {
        await tx.stock.update({
          where: { id: item.stockId },
          data: {
            quantity: { increment: item.quantity },
          },
        });
      }

      const transaction = await tx.transaction.update({
        where: { id },
        data: {
          status: TransactionStatus.CANCELLED,
        },
      });

      await tx.auditLog.create({
        data: {
          entity: AuditEntity.TRANSACTION,
          entityId: id,
          action: AuditAction.CANCEL,
          changes: {
            old: { status: existing.status },
            new: { status: transaction.status },
          } as Prisma.InputJsonValue,
        },
      });

      return transaction;
    });
  }

  async searchTransaction(query: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: query
        ? {
            OR: [
              { handledBy: { contains: query, mode: "insensitive" } },
              ...(Object.values(TransactionStatus).includes(
                query.toUpperCase() as TransactionStatus,
              )
                ? [{ status: query.toUpperCase() as TransactionStatus }]
                : []),
            ],
          }
        : {},
    });
  }
}

interface CreateTransactionItemInput {
  productId: number;
  stockId: number;
  quantity: number;
  unitPrice: number;
}
export interface CreateTransactionInput {
  status: TransactionStatus;
  handledBy: string;
  transactionItems: CreateTransactionItemInput[];
}
