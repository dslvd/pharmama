import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsEnum,
  IsInt,
  IsPositive,
  Min,
  ValidateNested,
} from "class-validator";
import { Prisma } from "src/generated/prisma/client";
import { TransactionStatus } from "src/generated/prisma/enums";
import { err, ok, Result } from "src/util/results.util";
import type { safeUserSelect } from "src/users/users.select";

export const validateStock = (
  stock: {
    quantity: number;
    expiryDate: Date;
    batchNumber: string;
    product: { name: string };
  } | null,
  requested: number,
): Result<true> => {
  if (!stock) {
    return err("Stock batch not found.");
  }

  const label = `${stock.product.name} (batch ${stock.batchNumber})`;
  if (stock.expiryDate <= new Date()) {
    return err(`${label} is expired and can't be sold.`);
  } else if (stock.quantity < requested) {
    return err(
      `Not enough stock for ${label}: requested ${requested}, only ${stock.quantity} left.`,
    );
  } else {
    return ok(true);
  }
};

export const validateTransactionExists = <T>(tr: T | null): Result<T> => {
  return tr ? ok(tr) : err("Transaction not found");
};

export function validateCancellable(transaction: {
  status: TransactionStatus;
}): Result<true, string> {
  if (transaction.status === TransactionStatus.CANCELLED) {
    return { ok: false, error: "Transaction is already cancelled" };
  }
  return { ok: true, value: true };
}

export const validateStatusUpdatable = <
  T extends { status: TransactionStatus },
>(
  transaction: T,
  newStatus: TransactionStatus,
): Result<T> => {
  if (transaction.status !== "COMPLETED") {
    return err(`Cannot change status of a ${transaction.status} transaction`);
  }

  if (newStatus === "COMPLETED") {
    return err("Transaction is already completed");
  }

  return ok(transaction);
};

export class TransactionItemDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  stockId!: number;
  @Type(() => Number) @IsInt() @Min(1) quantity!: number;
}

export class CreateTransactionDto {
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  @ArrayMinSize(1)
  transactionItems!: TransactionItemDto[];
}

export class UpdateTransactionStatusDto {
  @IsEnum(TransactionStatus) status!: TransactionStatus;
}

export type TransactionWithItems = Prisma.TransactionGetPayload<{
  include: {
    transactionItems: { include: { product: true } };
    user: { select: typeof safeUserSelect };
  };
}>;
