import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TypeAccount = createParamDecorator<string>((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.typeAccount as string;
});
