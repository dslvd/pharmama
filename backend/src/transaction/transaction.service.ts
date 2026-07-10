import { Injectable } from "@nestjs/common";
import { Transaction } from "src/generated/prisma/client";
import { TransactionCreateInput } from "src/interfaces/transaction.interface";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getTransaction(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  async createTransaction(data: TransactionCreateInput): Promise<Transaction> {
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

      const transaction = await tx.transaction.create({
        data: {
          totalAmount: data.totalAmount,
          status: data.status,
          transactionItems: {
            create: data.transactionItems,
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

      return transaction;
    });
  }

  async deleteTransaction(id: number): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      const trItems = await tx.transaction.findUnique({
        where: { id: id },
        select: { transactionItems: true },
      });

      if (!trItems) {
        throw new Error(`Transaction ${id} not found`);
      }

      for (const item of trItems.transactionItems) {
        await tx.stock.update({
          where: { id: item.stockId },
          data: {
            quantity: { increment: item.quantity },
          },
        });
      }

      const transaction = await tx.transaction.delete({
        where: { id: id },
      });

      return transaction;
    });
  }
}
