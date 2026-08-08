import { err, ok, Result } from "src/util/results";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export const validateStockExist = <T>(st: T | null): Result<T> => {
  return st ? ok(st) : err("Stock not found.");
};
export class CreateStockDto {
  @IsInt() @IsPositive() productId!: number;
  @IsString() @IsNotEmpty() batchNumber!: string;
  @IsInt() @IsPositive() quantity!: number;
  @IsDateString() expiryDate!: string;
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
