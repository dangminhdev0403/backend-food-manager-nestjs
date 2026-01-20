/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { RoleCreateBodyDTO, RoleUpdateBodyDTO } from 'src/routes/roles/role.dto';
import { RoleRepository } from 'src/routes/roles/role.repository';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
import { handleRecordNotFoundError, handleUniqueConstraintError } from 'src/shared/errors/primsa.error';
import { groupByModule } from 'src/shared/helpers';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);
  private readonly clientRoleId: number | null = null;
  constructor(private readonly roleRepository: RoleRepository) {}

  async getClientRoleId() {
    return this.roleRepository.getClientRoleId(this.clientRoleId);
  }
  async createRole(roleInput: RoleCreateBodyDTO, userId: number) {
    try {
      return await this.roleRepository.createRole(roleInput, userId);
    } catch (error) {
      handleUniqueConstraintError(error, `Tên quyền đã tồn tại`, `Quyền ${roleInput.name} đã tồn tại`);
      handleRecordNotFoundError(error, `Truyền sai permisonsId`, `Danh sách permisonsId chứa Id không tồn tại`);
      throw error;
    }
  }

  async getListRole(userId: number, roleIds: number[], pagable: PaginationDTOQuery) {
    return await this.roleRepository.getListRoleByUserId(userId,roleIds, pagable);
  }

  async updateRole(userId: number, roleUpdate: RoleUpdateBodyDTO) {
    try {
      await this.blockWithSystemRole(roleUpdate);
      const role = await this.roleRepository.updateRole(userId, roleUpdate);
      if (role == null)
        throw new BadRequestException({
          error: 'Không thể tạo quyền',
          message: 'Không thể tạo quyền',
        });
      const flattenedPermissions = role.permissions.map((p) => ({
        id: p.permission.id,
        name: p.permission.name,
        module: p.permission.module,
      }));
      const grouped = groupByModule(flattenedPermissions);

      return {
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: grouped,
      };
    } catch (error) {
      handleUniqueConstraintError(error, `Tên quyền đã tồn tại`, `Quyền ${roleUpdate.name} đã tồn tại`);
      handleRecordNotFoundError(error, `Truyền sai permisonsId`, `Danh sách permisonsId chứa Id không tồn tại`);
      throw error;
    }
  }
  async deleteRole(userId: number, roleUpdate: RoleUpdateBodyDTO) {
    try {
      await this.blockWithSystemRole(roleUpdate);

      return await this.roleRepository.deleteRole(userId, roleUpdate);
    } catch (error) {
      throw error;
    }
  }

  async blockWithSystemRole(data: { id: number }) {
    const role = await this.roleRepository.findSystemRole(data.id);
    if (role.isSystem === true)
      throw new ForbiddenException({
        error: 'Không thể thao tác',
        message: 'Bạn không được phép thao tác',
      });
  }

  async blockWithNotAdminRole( roleIds:number[]) {
    const isAdmin = await this.roleRepository.isUserAdmin( roleIds);
    if (!isAdmin)
      throw new ForbiddenException({
        error: 'Không thể thao tác',
        message: 'Bạn không được phép thao tác',
      });
  }
}
