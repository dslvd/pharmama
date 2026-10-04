import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import {
  Role,
  Transaction,
  TransactionStatus,
} from "src/generated/prisma/client";
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
import { unwrap } from "src/util/domain-error.util";

@Controller("transaction")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class TransactionController {
  constructor(private trService: TransactionService) {}

  @Get()
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async getTrList(): Promise<TransactionWithItems[]> {
    return this.trService.getTransactionList();
  }

  @Post()
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async createTr(
    @Body() trData: CreateTransactionDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Transaction> {
    return unwrap(await this.trService.createTransaction(trData, user.id));
  }

  @Patch(":id/updateStatus")
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async updateTrStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Transaction> {
    if (dto.status === TransactionStatus.REFUNDED && user.role === Role.STAFF) {
      throw new ForbiddenException("Only an owner can refund a sale.");
    }
    return unwrap(
      await this.trService.updateTransactionStatus(id, dto.status, user.id),
    );
  }
}
