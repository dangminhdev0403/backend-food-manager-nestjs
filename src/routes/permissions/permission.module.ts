/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common';
import { PermissionController } from 'src/routes/permissions/permission.controller';
import { PermissionRepository } from 'src/routes/permissions/permission.repository';
import { PermissionService } from 'src/routes/permissions/permission.service';
import { RoleModule } from 'src/routes/roles/role.module';

@Module({
  imports: [forwardRef(() => RoleModule)],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService, PermissionRepository],
})
export class PermissionModule {}
