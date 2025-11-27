/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { RolesService } from 'src/routes/auth/services/roles.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [AuthService, RolesService],
  exports: [AuthService, RolesService],
})
export class AuthModule {}
