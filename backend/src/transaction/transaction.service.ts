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
}
