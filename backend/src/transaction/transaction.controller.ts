import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { Role, Transaction } from "src/generated/prisma/client";
import {
  CreateTransactionDto,
  TransactionWithItems,
  UpdateTransactionStatusDto,
} from "./transaction.validation";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decorator/auth.decorator";
import type { AuthenticatedUser } from "src/auth/types/jwt-payload.type";

@Controller("transaction")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class TransactionController {
  constructor(private trService: TransactionService) {}

  @Get()
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async getTrList(): Promise<TransactionWithItems[]> {
    return this.trService.getTransactionList();
  }

  @Patch(":id")
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async cancelTr(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Transaction> {
    return this.trService.cancelTransaction(id, user.userId);
  }

  @Post()
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async createTr(
    @Body() trData: CreateTransactionDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Transaction> {
    return this.trService.createTransaction(trData, user.userId);
  }

  @Patch(":id/updateStatus")
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async updateTrStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Transaction> {
    return this.trService.updateTransactionStatus(id, dto, user.userId);
  }
}
