// auth/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/generated/prisma/enums";

// checks the user role and decide if the request will go through.
// @Roles on the method wins, otherwise the controller's @Roles is used.
// A route with no @Roles at all is denied, so a forgotten decorator
// never opens a route to every logged-in user.
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
