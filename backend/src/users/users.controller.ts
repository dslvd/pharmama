// users/users.controller.ts
import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { Role } from "src/generated/prisma/enums";
import { CreateUserDto } from "./users.validation";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decorator/auth.decorator";
import { unwrap } from "src/util/domain-error.util";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return unwrap(await this.usersService.create(dto));
  }
}
