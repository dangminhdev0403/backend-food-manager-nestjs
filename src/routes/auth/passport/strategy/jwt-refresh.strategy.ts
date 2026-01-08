import { Injectable, Ip, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { UserAgent } from 'src/shared/decorators/user-agent.decoreator';
import { RefreshTokenDecoded } from 'src/shared/types/jwt.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const jwtSecret = configService.get<string>('REFRESH_TOKEN_SECRET');
    if (!jwtSecret) {
      throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: jwtSecret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: RefreshTokenDecoded, @Ip() ip, @UserAgent() userAgent: string) {
    const refreshToken = req.body?.refreshToken ?? req.headers['authorization']?.replace('Bearer ', '');
    return await this.authService.validateUserJWTRefreshDecoded(payload.userId, refreshToken, { userAgent, ip });
  }
}
