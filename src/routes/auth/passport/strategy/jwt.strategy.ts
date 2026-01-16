import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/routes/auth/auth.service';
import { AccessTokenDecoded } from 'src/shared/types/jwt.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const jwtSecret = configService.get<string>('ACCESS_TOKEN_SECRET');
    if (!jwtSecret) {
      throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    } as {
      jwtFromRequest: (req: any) => string | null;
      ignoreExpiration: boolean;
      secretOrKey: string;
    });
  }

  async validate(payload: AccessTokenDecoded) {
    Logger.log(`JwtStrategy.validate jwt success: ${JSON.stringify(payload)}`);
    return await this.authService.validateUserJWTDecoded(payload.userId);
  }
}
