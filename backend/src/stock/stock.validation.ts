import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { Transform, Type } from "class-transformer";
import { Prisma } from "src/generated/prisma/client";

export class CreateStockDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  productId!: number;
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  batchNumber!: string;
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantity!: number;
  @Transform(({ value }) => value?.trim()) @IsDateString() expiryDate!: string;
}

export class UpdateStockDto extends PartialType(CreateStockDto) {}

export type StockWithProduct = Prisma.StockGetPayload<{
  include: { product: true };
}>;
