/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from 'src/routes/auth/auth.repository';
import { AuthService } from 'src/routes/auth/auth.service';
import { JwtRefreshStrategy } from 'src/routes/auth/passport/strategy/jwt-refresh.strategy';
import { JwtStrategy } from 'src/routes/auth/passport/strategy/jwt.strategy';
import { LocalStrategy } from 'src/routes/auth/passport/strategy/local.strategy';
import { RoleModule } from 'src/routes/roles/role.module';
import { RolesService } from 'src/routes/roles/roles.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, PassportModule ,RoleModule ],
  controllers: [],
  providers: [AuthService, AuthRepository, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
