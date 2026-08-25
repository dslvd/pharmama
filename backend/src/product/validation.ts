import { PartialType } from "@nestjs/mapped-types";
import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";
import { Category } from "src/generated/prisma/enums";
import { Result, ok, err } from "src/util/results";

export const validateProductExists = <T>(pr: T | null): Result<T> => {
  return pr ? ok(pr) : err("Product not found.");
};

export class CreateProductDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name!: string;
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  genericName!: string;
  @Transform(({ value }) => value?.trim())
  @IsEnum(Category)
  category!: Category;
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
