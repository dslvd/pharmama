import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Transaction } from "src/interfaces/transaction.interface";

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getTransaction(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }
}
