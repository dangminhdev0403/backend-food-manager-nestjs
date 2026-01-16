import { RolesService } from 'src/routes/roles/roles.service';
import { RoleController } from './role.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { RoleRepository } from 'src/routes/roles/role.repository';

@Module({
  controllers: [RoleController],
  providers: [RolesService, RoleRepository],
  exports :[RolesService]
})
export class RoleModule {}
