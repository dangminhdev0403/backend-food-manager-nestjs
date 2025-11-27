/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { RegisterBodyDTO } from 'src/routes/auth/auth.dto';
import { AuthService } from 'src/routes/auth/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() body: RegisterBodyDTO) {
    return await this.authService.registerUser(body);
  }
}
