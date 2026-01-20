import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from 'src/routes/permissions/permission.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';
import { AuthorizationGuard } from 'src/shared/guard/authorization.guard';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(AuthorizationGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: 'Permissions:Get List' })
  async getAllPermission(@Request() req: RequestLogined) {
    return await this.permissionService.getListPermission(req.user.roleIds);
  }
}
