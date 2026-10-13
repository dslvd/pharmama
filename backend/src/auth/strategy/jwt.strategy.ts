import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";

// checks the Bearer token on each request
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

  // reload the user so a deactivation or role change applies right away
  async validate(payload: { sub: number; email: string; role: string }) {
    const user = await this.usersService.findActiveSafeById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Account not found or deactivated.");
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
