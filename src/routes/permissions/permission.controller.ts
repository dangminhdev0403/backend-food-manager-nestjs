import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from 'src/routes/permissions/permission.service';
import { UserInRequest } from 'src/shared/constants/auth.constant';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: 'Permissions:Get List' })
  async getAllPermission(@Request() req: UserInRequest) {
    return await this.permissionService.getListPermission(req.user.id);
  }

 
}
