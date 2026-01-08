import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { whitelist } from 'src/shared/constants/auth.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    Logger.log('JwtAuthGuard.canActivate');

    const request: Request = context.switchToHttp().getRequest<Request>();
    const path = request.path;

    Logger.log(`Check public route:${path}`);
    const isWhitelisted = whitelist.some((route) => {
      if (typeof route === 'string') return route === path;
      if (route instanceof RegExp) return route.test(path);
      return false;
    });
    if (isWhitelisted) {
      Logger.log(`This route is public:${path}`);
      return true;
    }
    Logger.log(`This route is not public:${path}`);
    return super.canActivate(context);
  }
}
