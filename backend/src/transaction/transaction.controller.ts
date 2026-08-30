import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { Transaction } from "src/generated/prisma/client";
import {
  CreateTransactionDto,
  TransactionWithItems,
  UpdateTransactionStatusDto,
} from "./validation";

@Controller("transaction")
export class TransactionController {
  constructor(private trService: TransactionService) {}

  @Get(":id")
  async getTr(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<TransactionWithItems> {
    return this.trService.getTransaction(id);
  }

  @Get()
  async getTrList(): Promise<TransactionWithItems[]> {
    return this.trService.getTransactionList();
  }

  @Patch(":id")
  async cancelTr(@Param("id", ParseIntPipe) id: number): Promise<Transaction> {
    return this.trService.cancelTransaction(id);
  }

  @Post()
  async createTr(@Body() trData: CreateTransactionDto): Promise<Transaction> {
    return this.trService.createTransaction(trData);
  }

  @Patch(":id/updateStatus")
  async updateTrStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionStatusDto,
  ): Promise<Transaction> {
    return this.trService.updateTransactionStatus(id, dto);
  }
}
