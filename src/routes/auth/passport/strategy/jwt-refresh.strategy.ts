import { Injectable, Ip, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/routes/auth/auth.service';
import { RefreshTokenDecoded } from 'src/shared/constants/jwt.type';
import { UserAgent } from 'src/shared/decorators/user-agent.decoreator';

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
    const refreshToken = req.body?.refreshToken;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    const accessToken = authHeader.replace('Bearer ', '');

    return await this.authService.validateUserJWTRefreshDecoded(payload.userId, refreshToken, accessToken, {
      userAgent,
      ip,
    });
  }
}
