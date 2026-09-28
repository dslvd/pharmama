// auth/auth.service.ts
import { Injectable } from "@nestjs/common";
import { toSafeUser } from "../users/users.domain";
import { unauthorized } from "src/util/domain-error";
import { fromNullable } from "src/util/results.util";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) return null;

    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatches) return null;

    return toSafeUser(user);
  }

  me(userId: number) {
    return this.usersService
      .findActiveSafeById(userId)
      .then(fromNullable(unauthorized("Account not found or deactivated.")));
  }

  async login(user: { id: number; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
