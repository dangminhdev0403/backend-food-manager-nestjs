import { Module } from '@nestjs/common';
import { PermissionModule } from 'src/routes/permissions/permission.module';
import { RoleModule } from 'src/routes/roles/role.module';
import { UserRepository } from 'src/routes/users/user.repository';
import { UserController } from './user.controllers';
import { UserService } from './user.service';

@Module({
  imports: [RoleModule, PermissionModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
