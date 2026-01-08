// src/common/jwt/jwt.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('ACCESS_TOKEN_EXPIRES_IN');
        const secret = configService.get<string>('ACCESS_TOKEN_SECRET');

        if (!expiresIn) {
          throw new Error('ACCESS_TOKEN_SECRET is missing');
        }
        if (!secret) {
          throw new Error('ACCESS_TOKEN_SECRET is missing');
        } 

        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as StringValue,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
