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
import type { safeUserSelect } from "src/users/users.select";

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
