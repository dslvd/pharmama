import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import {
  Prisma,
  Transaction,
  TransactionStatus,
} from "src/generated/prisma/client";
import type { TransactionCreateInput } from "src/interfaces/transaction.interface";

@Controller("transaction")
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async getTr(
    @Query("status", new ParseEnumPipe(TransactionStatus, { optional: true }))
    status?: TransactionStatus,
    @Query("handledBy") handledBy?: string,
    @Query("order") order?: Prisma.SortOrder,
  ): Promise<Transaction[]> {
    return this.transactionService.getTransaction({ status, handledBy, order });
  }

  @Get("getTodaySales")
  async getTodaySales(): Promise<{ total: number; date: string }> {
    return this.transactionService.getTodaySales();
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
