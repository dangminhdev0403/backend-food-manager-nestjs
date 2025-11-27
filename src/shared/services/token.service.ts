/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envConfig } from 'src/shared/config';
import { JwtPayload } from 'src/shared/types/jwt.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {} // ✅ sửa tên

  signAccessToken(payload: { userId: number }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      algorithm: 'HS256',
      expiresIn: Number(envConfig.ACCESS_TOKEN_EXPIRES_IN),
    });
  }
  signRefreshToken(payload: { userId: number }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      algorithm: 'HS256',
      expiresIn: Number(envConfig.REFRESH_TOKEN_EXPIRES_IN),
    });
  }

  verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }
  verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }
}
