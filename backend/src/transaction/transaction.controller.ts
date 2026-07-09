import { Body, Controller, Get, Post } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { Transaction } from "src/generated/prisma/client";
import type { TransactionCreateInput } from "src/interfaces/transaction.interface";

@Controller("transaction")
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get("transaction")
  async getTransaction(): Promise<Transaction[]> {
    return this.transactionService.getTransaction();
  }

  @Post("transaction")
  async createTransaction(
    @Body() trData: TransactionCreateInput,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(trData);
  }
}
