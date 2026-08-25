import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { TransactionStatus } from "src/generated/prisma/enums";
import { err, ok, Result } from "src/util/results";

export const validateStock = (
  stock: { quantity: number } | null,
  requested: number,
): Result<true> => {
  if (!stock) {
    return err("Stock not found");
  } else if (stock.quantity < requested) {
    return err(`Insufficient stock: have ${stock.quantity}`);
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
  productId!: number;
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  stockId!: number;
  @Type(() => Number) @IsInt() @Min(1) quantity!: number;
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  unitPrice!: number;
}

export class CreateTransactionDto {
  @Transform(({ value }) => value?.trim())
  @IsEnum(TransactionStatus)
  status!: TransactionStatus;
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  handledBy!: string;
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  @ArrayMinSize(1)
  transactionItems!: TransactionItemDto[];
}

export class UpdateTransactionStatusDto {
  @IsEnum(TransactionStatus) status!: TransactionStatus;
}
