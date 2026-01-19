/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedTokenRepository } from 'src/shared/repositories/token.repository';
import { SharedUserRepository } from 'src/shared/repositories/user.repository';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';

const sharedServices = [PrismaService, HashingService, TokenService, SharedUserRepository, SharedTokenRepository];

@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
  imports: [ConfigModule],
})
export class SharedModule {}
