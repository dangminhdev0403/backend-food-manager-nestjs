import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// LocalAuthGuard extends AuthGuard('local') để sử dụng chiến lược xác thực 'local'.
// AuthGuard('local') là một lớp bảo vệ (guard) được cung cấp bởi NestJS Passport.
export class LocalAuthGuard extends AuthGuard('local') {}
