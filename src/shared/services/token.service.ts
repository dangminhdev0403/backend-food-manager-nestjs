/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envConfig } from 'src/shared/config';
import {
  AccessTokenDecoded,
  AccessTokenPayload,
  RefreshTokenDecoded,
  RefreshTokenPayload,
} from 'src/shared/types/jwt.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {} // ✅ sửa tên

  signAccessToken(payload: AccessTokenPayload) {
    return this.jwtService.signAsync(
      {
        ...payload,
        uuid: crypto.randomUUID(),
      },
      {
        secret: envConfig.ACCESS_TOKEN_SECRET,
        algorithm: 'HS256',
        expiresIn: Number(envConfig.ACCESS_TOKEN_EXPIRES_IN),
      },
    );
  }
  async signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(
      { ...payload, uuid: crypto.randomUUID() },
      {
        secret: envConfig.REFRESH_TOKEN_SECRET,
        algorithm: 'HS256',
        expiresIn: Number(envConfig.REFRESH_TOKEN_EXPIRES_IN),
      },
    );
  }
  async generateToken(payload: AccessTokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken({ userId: payload.userId }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string): Promise<AccessTokenDecoded> {
    return await this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }
  async verifyRefreshToken(token: string): Promise<RefreshTokenDecoded> {
    return await this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }
}
