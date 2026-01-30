import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { publicMatcher } from 'src/shared/config/routes.config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    Logger.log('JwtAuthGuard.canActivate');

    const request: Request = context.switchToHttp().getRequest<Request>();
    const path = request.path;

    if (publicMatcher.isPublic(path)) {
      Logger.debug(`Public route: ${path}`);
      return true;
    }
    Logger.debug(`Protected route: ${path}`);

    Logger.log(`This route is not public:${path}`);
    return super.canActivate(context);
  }
}

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
