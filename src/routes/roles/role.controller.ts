/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleCreateBodyDTO } from 'src/routes/roles/role.dto';
import { RoleService } from 'src/routes/roles/role.service';
import { UserInRequest } from 'src/shared/constants/auth.constant';
@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Role:Create' })
  async createRole(@Body() roleInput: RoleCreateBodyDTO, @Request() req: UserInRequest) {
    return await this.roleService.createRole(roleInput, req.user.id);
  }
  @Get()
  @ApiOperation({ summary: 'Role:Create' })
  async getRole(@Request() req: UserInRequest, @Query('page') page: number, @Query('size') size: number) {
    return await this.roleService.getListRole(req.user.id);
  }
}
