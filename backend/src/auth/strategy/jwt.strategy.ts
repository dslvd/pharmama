// jwt.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";

// verify the attached jwt token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // checks the DB on every request, so a deactivated user is locked out
  // right away and a role change applies without logging in again
  async validate(payload: { sub: number; email: string; role: string }) {
    const user = await this.usersService.findActiveSafeById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Account not found or deactivated.");
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
