// users/users.controller.ts
import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { Roles } from "../auth/decorator/roles.decorator";
import { Role } from "src/generated/prisma/enums";
import { CreateUserDto } from "./users.validation";
import { RolesGuard } from "src/auth/roles.guard";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
