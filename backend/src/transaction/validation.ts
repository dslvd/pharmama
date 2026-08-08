import { Type } from "class-transformer";
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

export class TransactionItemDto {
  @IsInt() @IsPositive() productId!: number;
  @IsInt() @IsPositive() stockId!: number;
  @IsInt() @Min(1) quantity!: number;
  @IsNumber() @IsPositive() unitPrice!: number;
}

export class CreateTransactionDto {
  @IsEnum(TransactionStatus) status!: TransactionStatus;
  @IsString() @IsNotEmpty() handledBy!: string;
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  @ArrayMinSize(1)
  transactionItems!: TransactionItemDto[];
}
