import { err, ok, Result } from "src/util/results";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { Transform, Type } from "class-transformer";

export const validateStockExist = <T>(st: T | null): Result<T> => {
  return st ? ok(st) : err("Stock not found.");
};
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

export const validateExpiryDate = (expiryDate: string): Result<Date> => {
  const parsed = new Date(expiryDate);

  if (isNaN(parsed.getTime())) {
    return err("Invalid expiry date.");
  } else if (parsed <= new Date()) {
    return err("Expiry date must be in the future.");
  } else {
    return ok(parsed);
  }
};
