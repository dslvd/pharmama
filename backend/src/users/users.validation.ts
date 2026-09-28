import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsIn,
} from "class-validator";
import { Role } from "src/generated/prisma/enums";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  // ADMIN is a dev-only account and can't be created through the API
  @IsOptional()
  @IsIn([Role.STAFF, Role.OWNER], { message: "role must be STAFF or OWNER" })
  role?: Role;
}
