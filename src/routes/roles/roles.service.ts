/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { RoleRepository } from 'src/routes/roles/role.repository';

@Injectable()
export class RolesService {
  private readonly clientRoleId: number | null = null;
  constructor(private readonly roleRepository: RoleRepository) {}

  async getClientRoleId() {
    return this.roleRepository.getClientRoleId(this.clientRoleId);
  }
}
