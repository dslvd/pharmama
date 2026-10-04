import { PartialType } from "@nestjs/mapped-types";
import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
} from "class-validator";
import { Category } from "src/generated/prisma/enums";

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
  // matches the Decimal(10, 2) price column
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(99999999.99)
  price!: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
