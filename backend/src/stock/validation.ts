import { err, ok, Result } from "src/util/results";

export const validateStockExist = <T>(st: T | null): Result<T> => {
  return st ? ok(st) : err("Stock not found.");
};

import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateStockDto {
  @IsInt() @IsPositive() productId!: number;
  @IsString() @IsNotEmpty() batchNumber!: string;
  @IsInt() @IsPositive() quantity!: number;
  @IsDateString() expiryDate!: string;
}
