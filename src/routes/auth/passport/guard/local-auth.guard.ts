import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationException } from 'nestjs-zod';
import { LoginBodySchema } from 'src/routes/auth/auth.model';

@Injectable()
// LocalAuthGuard extends AuthGuard('local') để sử dụng chiến lược xác thực 'local'.
// AuthGuard('local') là một lớp bảo vệ (guard) được cung cấp bởi NestJS Passport.
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const parsed = LoginBodySchema.safeParse(request.body);
    if (!parsed.success) {
       throw new ZodValidationException(parsed.error);

    }

    return super.canActivate(context);
  }
}
