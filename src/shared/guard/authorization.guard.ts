import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PermissionService } from 'src/routes/permissions/permission.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';
import { HTTPMethod } from '../../../generated/prisma/enums';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(private readonly permissionService: PermissionService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    this.logger.debug('AuthorizationGuard canActivate called');

    const req = ctx.switchToHttp().getRequest<RequestLogined>();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Unauthenticated');
    }

    const roleIds = user.roleIds ?? [];
    const method = req.method.toUpperCase() as HTTPMethod;

    // ⚠️ dùng route path chuẩn, không dùng originalUrl
    const path = req.route?.path;
    if (!path) {
      throw new InternalServerErrorException('Route path not resolved');
    }

    const allowed = await this.permissionService.hasPermission(roleIds, path, method);

    if (!allowed) {
      throw new ForbiddenException({
        error: 'Không có quyền truy cập',
        message: 'Bạn không có quyền truy cập chức năng này',
      });
    }

    return true;
  }
}
