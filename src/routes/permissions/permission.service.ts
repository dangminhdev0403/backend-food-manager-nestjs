/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { HTTPMethod } from 'generated/prisma/enums';
import { PermissionRepository } from 'src/routes/permissions/permission.repository';
import { RoleService } from 'src/routes/roles/role.service';
import { envConfig } from 'src/shared/config/env.config';
import { groupByModule } from 'src/shared/helpers/helpers';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly roleService: RoleService,
  ) {}
  async getListPermission(roleIds: number[]) {
    const listPermissions = await this.permissionRepository.getListPermissionGroupedList();
    return groupByModule(listPermissions);
  }

  async getPermissionByRoleId(roleId: number, roleIds: number[]) {
     this.roleService.blockWithNotAdminRole(roleIds);
    const permission = await this.permissionRepository.getPermissionByRoleId(roleId);
    return groupByModule(permission);
  }

  async hasPermission(roleIds: number[], path: string, method: HTTPMethod): Promise<boolean> {
    const ADMIN_ID = Number(envConfig.ADMIN_ID);

    // 1. Admin bypass
    if (roleIds.includes(ADMIN_ID)) {
      return true;
    }

    // 2. Public permission (tạm thời)
    if (method === HTTPMethod.GET && path === '/permissions') {
      return true;
    }

    // 3. RBAC check
    return Boolean(await this.permissionRepository.hasPermission(roleIds, path, method));
  }
}
