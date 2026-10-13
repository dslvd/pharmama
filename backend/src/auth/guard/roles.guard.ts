import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/generated/prisma/enums";

// Lets a request through only if the user's role is in @Roles (the method's,
// or else the controller's). No @Roles means no access, so a missing one
// can't open a route to everyone.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return false;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
