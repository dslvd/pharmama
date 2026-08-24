import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import {
  Prisma,
  Transaction,
  TransactionStatus,
} from "src/generated/prisma/client";
import { CreateTransactionDto } from "./validation";

@Controller("transaction")
export class TransactionController {
  constructor(private trService: TransactionService) {}

  @Get("search")
  async searchTr(@Query("query") query: string): Promise<Transaction[]> {
    return this.trService.searchTransaction(query);
  }

  @Get(":id")
  async getTr(@Param("id", ParseIntPipe) id: number): Promise<Transaction> {
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

  @Patch(":id")
  async cancelTr(@Param("id", ParseIntPipe) id: number): Promise<Transaction> {
    return this.trService.cancelTransaction(id);
  }

  @Post()
  async createTr(@Body() trData: CreateTransactionDto): Promise<Transaction> {
    return this.trService.createTransaction(trData);
  }
}
