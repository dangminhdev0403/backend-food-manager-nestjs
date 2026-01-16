/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, Ip, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

import { LoginResDTO, LogoutBodyDTO, RegisterBodyDTO, RegisterResDTO, SendOTPBodyDTO } from 'src/routes/auth/auth.dto';
import { AuthService } from 'src/routes/auth/auth.service';
import { JwtRefreshGuard } from 'src/routes/auth/passport/guard/jwt-auth.guard';
import { LocalAuthGuard } from 'src/routes/auth/passport/guard/local-auth.guard';
import { SuccessMessage } from 'src/shared/decorators/success-message.decorator';
import { UserAgent } from 'src/shared/decorators/user-agent.decoreator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @SuccessMessage('Đăng kí thành công')
  @ApiOperation({ summary: 'User register' })
 
  @ZodSerializerDto(RegisterResDTO)
  async registerUser(@Body() body: RegisterBodyDTO) {
    return await this.authService.registerUser(body);
  }
  @Post('otp')
  @SuccessMessage('gửi mã OTP thành công')
      @ApiOperation({ summary: 'User send OTP' })
   @HttpCode(200) 
  async sendOTP(@Body() body: SendOTPBodyDTO) {
    return await this.authService.sendOTP(body);
  }
  @Post('login')
  @SuccessMessage('Đăng nhập thành công')
   @ApiOperation({ summary: 'User login' })
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
  @ApiOperation({ summary: 'User get Refresh Token' })
  @HttpCode(200)
  async refreshToken(@Request() req) {
    return req.user;
  }
  @Post('logout')
  @SuccessMessage('Đăng xuất thành công')
  @ApiOperation({ summary: 'User logout' })
  @HttpCode(200)
  async logout(@Body() body: LogoutBodyDTO) {
    return await this.authService.logout(body.refreshToken);
  }
}
