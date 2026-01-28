/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from 'src/routes/permissions/permission.service';
import { RoleCreateBodyDTO, RoleUpdateBodyDTO } from 'src/routes/roles/role.dto';
import { RoleService } from 'src/routes/roles/role.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
import { AuthorizationGuard } from 'src/shared/guard/authorization.guard';
@ApiTags('Vai trò')
@Controller('roles')
@UseGuards(AuthorizationGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo vai trò',
    description: 'Tạo mới một vai trò trong hệ thống ',
  })
  async createRole(@Body() roleInput: RoleCreateBodyDTO, @Request() req: RequestLogined) {
    return this.roleService.createRole(roleInput, req.user.id);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Danh sách vai trò',
    description: 'Lấy danh sách vai trò ',
  })
  async getRole(@Request() req: RequestLogined, @Query() query: PaginationDTOQuery) {
    return this.roleService.getListRole(req.user.id, req.user.roleIds, query);
  }

  @Get(':roleId/permissions')
  @ApiOperation({
    summary: 'Danh sách quyền của vai trò',
    description: 'Lấy danh sách quyền theo vai trò cụ thể',
  })
  async getPermissionByRoleId(@Request() req: RequestLogined, @Param('roleId', ParseIntPipe) roleId: number) {
    return this.permissionService.getPermissionByRoleId(roleId, req.user.roleIds);
  }

  @Put()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Cập nhật vai trò',
    description: 'Cập nhật thông tin vai trò ',
  })
  async updateRole(@Request() req: RequestLogined, @Body() data: RoleUpdateBodyDTO) {
    return this.roleService.updateRole(req.user.id, data);
  }

  @Delete()
  @ApiOperation({
    summary: 'Xoá vai trò',
    description: 'Xoá vai trò khỏi hệ thống (soft delete nếu hỗ trợ)',
  })
  async deleteRole(@Request() req: RequestLogined, @Body() data: RoleUpdateBodyDTO) {
    return this.roleService.deleteRole(req.user.id, data);
  }
}
