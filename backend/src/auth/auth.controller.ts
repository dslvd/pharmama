// auth/auth.controller.ts
import { Controller, Post, UseGuards, Request, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local")) // runs the local.strategy
  @Post("login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  me(@Request() req) {
    return req.user; // include id, email, role
  }
}
