/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, Ip, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';

import { LoginResDTO, LogoutBodyDTO, RegisterBodyDTO, RegisterResDTO, SendOTPBodyDTO } from 'src/routes/auth/auth.dto';
import { JwtRefreshGuard } from 'src/routes/auth/passport/guard/jwt-auth.guard';
import { LocalAuthGuard } from 'src/routes/auth/passport/guard/local-auth.guard';
import { AuthService } from 'src/routes/auth/services/auth.service';
import { UserAgent } from 'src/shared/decorators/user-agent.decoreator';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
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
  @UseGuards(LocalAuthGuard)
  @ZodSerializerDto(LoginResDTO)
  async login(@UserAgent() userAgent: string, @Ip() ip: string, @Request() req) {
    return await this.authService.login(req.user.email, {
      userAgent,
      ip,
    });
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  async refreshToken(@Request() req) {
    return req.user;
  }
  @Post('logout')
  @HttpCode(200)
  async logout(@Body() body: LogoutBodyDTO) {
    return await this.authService.logout(body.refreshToken);
  }
}
