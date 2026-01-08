/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from 'src/routes/auth/auth.repository';
import { JwtStrategy } from 'src/routes/auth/passport/strategy/jwt.strategy';
import { LocalStrategy } from 'src/routes/auth/passport/strategy/local.strategy';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { RolesService } from 'src/routes/auth/services/roles.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, PassportModule],
  controllers: [],
  providers: [AuthService, RolesService, AuthRepository, LocalStrategy, JwtStrategy],
  exports: [AuthService, RolesService],
})
export class AuthModule {}
