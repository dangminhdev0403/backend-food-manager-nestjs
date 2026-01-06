/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, Ip, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO,
} from 'src/routes/auth/auth.dto';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { UserAgent } from 'src/shared/decorators/user-agent.decoreator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDTO)
  async registerUser(@Body() body: RegisterBodyDTO) {
    return await this.authService.registerUser(body);
  }
  @Post('otp')
  async sendOTP(@Body() body: SendOTPBodyDTO) {
    return await this.authService.sendOTP(body);
  }
  @Post('login')
  @HttpCode(200)
  @ZodSerializerDto(LoginResDTO)
  async login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return await this.authService.login(body, {
      userAgent,
      ip,
    });
  }

  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() body: RefreshTokenBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    console.log('test Refresh');

    return await this.authService.refreshToken(body.refreshToken, {
      userAgent,
      ip,
    });
  }
}
