/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PermissionRepository } from 'src/routes/permissions/permission.repository';
import { RoleService } from 'src/routes/roles/role.service';
import { groupByMoudle } from 'src/shared/helpers';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly roleService: RoleService,
  ) {}
  async getListPermission(userId: number) {
    await this.roleService.blockWithNotAdminRole(userId);
    const listperrmisions = await this.permissionRepository.getListPermissionGroupedList();
    return groupByMoudle(listperrmisions);
  }

  async getPermissionByRoleId(roleId: number, userId: number) {
    await this.roleService.blockWithNotAdminRole(userId);
    const permission = await this.permissionRepository.getPermissionByRoleId(roleId);
    return groupByMoudle(permission);
  }
 
}
