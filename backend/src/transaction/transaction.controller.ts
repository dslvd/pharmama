import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { Transaction } from "src/generated/prisma/client";
import type { TransactionCreateInput } from "src/interfaces/transaction.interface";

@Controller("transaction")
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async getTr(): Promise<Transaction[]> {
    return this.transactionService.getTransaction();
  }

  @Delete(":id")
  async deleteTr(@Param("id", ParseIntPipe) id: number): Promise<Transaction> {
    return this.transactionService.deleteTransaction(id);
  }

  @Post()
  async createTr(@Body() trData: TransactionCreateInput): Promise<Transaction> {
    return this.transactionService.createTransaction(trData);
  }
}
