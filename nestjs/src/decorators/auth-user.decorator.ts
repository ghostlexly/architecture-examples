import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Housekeeper } from "@prisma/client";

const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Housekeeper => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export { AuthUser };
