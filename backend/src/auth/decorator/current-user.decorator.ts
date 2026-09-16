// auth/decorator/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// gets the current user
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
