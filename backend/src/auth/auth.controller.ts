// auth/auth.controller.ts
import { Controller, Post, UseGuards, Request, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { unwrap } from "src/util/domain-error.util";
import { CurrentUser } from "./decorator/current-user.decorator";
import type { AuthenticatedUser } from "./types/jwt-payload.type";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local")) // runs the local.strategy
  @Post("login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  async me(@CurrentUser() user: AuthenticatedUser) {
    return unwrap(await this.authService.me(user.id));
  }
}
