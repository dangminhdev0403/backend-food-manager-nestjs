import { RoleService } from 'src/routes/roles/role.service';
import { RoleController } from './role.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { RoleRepository } from 'src/routes/roles/role.repository';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
