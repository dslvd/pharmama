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
import {
  type CreateTransactionInput,
  TransactionService,
} from "./transaction.service";
import {
  Prisma,
  Transaction,
  TransactionStatus,
} from "src/generated/prisma/client";

@Controller("transaction")
export class TransactionController {
  constructor(private trService: TransactionService) {}

  @Get("search")
  async searchProducts(@Query("query") query: string): Promise<Transaction[]> {
    return this.trService.searchTransaction(query);
  }

  @Get(":id")
  async getTr(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Transaction | null> {
    return this.trService.getTransaction(id);
  }

  @Get()
  async getTrList(
    @Query("status", new ParseEnumPipe(TransactionStatus, { optional: true }))
    status?: TransactionStatus,
    @Query("handledBy") handledBy?: string,
    @Query("order") order?: Prisma.SortOrder,
  ): Promise<Transaction[]> {
    return this.trService.getTransactionList({ status, handledBy, order });
  }

  @Get("getTodaySales")
  async getTodaySales(): Promise<{ total: number; date: string }> {
    return this.trService.getTodaySales();
  }

  @Delete(":id")
  async cancelTr(@Param("id", ParseIntPipe) id: number): Promise<Transaction> {
    return this.trService.cancelTransaction(id);
  }

  @Post()
  async createTr(@Body() trData: CreateTransactionInput): Promise<Transaction> {
    return this.trService.createTransaction(trData);
  }
}
