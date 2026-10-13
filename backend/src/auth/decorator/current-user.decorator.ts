import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// the signed-in user, set by the JWT strategy
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
