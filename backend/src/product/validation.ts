import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { Category } from "src/generated/prisma/enums";
import { Result, ok, err } from "src/util/results";

export const validateProductExists = <T>(pr: T | null): Result<T> => {
  return pr ? ok(pr) : err("Product not found.");
};

export class CreateProductDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsString() @IsNotEmpty() genericName!: string;
  @IsString() @IsNotEmpty() category!: Category;
  @IsNumber() @IsPositive() price!: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
