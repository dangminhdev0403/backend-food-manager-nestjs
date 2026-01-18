import { RoleService } from 'src/routes/roles/role.service';
import { RoleController } from './role.controller';
/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common';
import { PermissionModule } from 'src/routes/permissions/permission.module';
import { RoleRepository } from 'src/routes/roles/role.repository';

@Module({
  imports: [forwardRef(() => PermissionModule)],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
