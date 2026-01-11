import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginBodySchema } from 'src/routes/auth/auth.model';
import { AuthService } from 'src/routes/auth/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',

    }
    );

  }

  async validate(email: string, password: string) {

    
    const user = await this.authService.validateUser(email, password);

    return user;
  }
}
