// auth/auth.controller.ts
import { Controller, Post, UseGuards, Request } from "@nestjs/common";
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
}
