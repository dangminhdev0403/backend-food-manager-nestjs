/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger } from '@nestjs/common';
import { RoleCreateBodyDTO } from 'src/routes/roles/role.dto';
import { RoleRepository } from 'src/routes/roles/role.repository';
import { handleRecordNotFoundError, handleUniqueConstraintError } from 'src/shared/errors/primsa.error';

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

  async getListRole(userId: number) {}
}
