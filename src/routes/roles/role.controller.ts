/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleCreateBodyDTO, RoleUpdateBodyDTO } from 'src/routes/roles/role.dto';
import { RoleService } from 'src/routes/roles/role.service';
import { UserInRequest } from 'src/shared/constants/auth.constant';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
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
  @HttpCode(200)
  @ApiOperation({ summary: 'Role:Get List' })
  async getRole(@Request() req: UserInRequest, @Query() query: PaginationDTOQuery) {
    return await this.roleService.getListRole(req.user.id, query);
  }
  @Put()
  @HttpCode(200)
  @ApiOperation({ summary: 'Role:Update' })
  async updateRole(@Request() req: UserInRequest, @Body() data: RoleUpdateBodyDTO) {
    return await this.roleService.updateRole(req.user.id, data);
  }
  @Delete()
  @ApiOperation({ summary: 'Role:Delete' })
  async deleteRole(@Request() req: UserInRequest, @Body() data: RoleUpdateBodyDTO) {
    return await this.roleService.deleteRole(req.user.id, data);
  }
}
