/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import { RegisterBodyType, SendOTPBodyType, UserResponseSchema } from 'src/routes/auth/auth.model';
import { AuthRepository } from 'src/routes/auth/auth.repository';
import { RoleService } from 'src/routes/roles/role.service';
import { envConfig, generateOTP } from 'src/shared/config/env.config';
import { isUniqueConstraintError } from 'src/shared/helpers';
import { SharedUserRepository } from 'src/shared/repositories/user.repository';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly hashingService: HashingService,
    private readonly RoleService: RoleService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRespo: SharedUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(body: RegisterBodyType): Promise<Omit<RegisterBodyType, 'password' | 'roleId'>> {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);

      const roleId = await this.RoleService.getClientRoleId();

      return await this.authRepository.createUser(
        {
          email: body.email,
          name: body.name,
          phoneNumber: body.phoneNumber,
          password: hashedPassword,
        },
        roleId,
      );
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new UnprocessableEntityException([
          {
            path: 'email',
            message: 'Email is already in use',
          },
        ]);
      }
      throw error;
    }
  }

  async verifyUser(body: RegisterBodyType) {
    const verificationCode = await this.authRepository.findUniqueVerificationCode({
      email: body.email,
      code: body.code,
      type: 'REGISTER',
    });

    if (!verificationCode) {
      throw new UnprocessableEntityException([
        {
          error: 'Mã OTP không hợp lệ',
          message: 'Mã OTP không hợp lệ hoặc đã hết hạn',
          path: 'code',
        },
      ]);
    }
  }
  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRespo.findUnique({ email: body.email });
    if (!user) {
      throw new UnprocessableEntityException([
        {
          path: 'email',
          message: 'Email is not registered',
        },
      ]);
    }
    const createdOTP = generateOTP();
    const verificationCode = await this.authRepository.createVerìficationCode({
      email: body.email,
      type: body.type,
      code: createdOTP,
      expiresAt: addMilliseconds(new Date(), Number.parseInt(ms(envConfig.OTP_EXPIRES_IN))), // 5 minutes from now
    });
    return verificationCode;
  }

  async generateTokens(payload: AccessTokenPayload) {
    return await this.tokenService.generateToken(payload);
  }

  async validateUser(email: string, password: string) {
    const loginUser = await this.authRepository.findUserByEmailOrId({
      email,
    });
    if (!loginUser) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    }
    const isPassMatch = await this.hashingService.compare(password, loginUser.password);
    if (!isPassMatch) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    }
    console.log('service here', typeof loginUser);

    const parsed = UserResponseSchema.safeParse(loginUser);

    if (!parsed.success) {
      this.logger.error(parsed.error.format()); // để xem lỗi

      throw new UnauthorizedException('User schema invalid');
    }
    return parsed.data;
  }

  async login(email: string, meta: { userAgent: string; ip: string }) {
    const loginUser = await this.authRepository.findUniqueUserIncludeRole({
      email,
    });
    if (!loginUser) throw new UnauthorizedException();
    const device = await this.authRepository.createDevice({
      userId: loginUser.id,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
    const tokens = await this.generateTokens({
      userId: loginUser.id,
      deviceId: loginUser.id,
    });
    const refreshTokenDecoded = await this.tokenService.verifyRefreshToken(tokens.refreshToken);
    await this.authRepository.createRefreshToken({
      token: tokens.refreshToken,
      User: {
        connect: {
          id: loginUser.id,
        },
      },

      device: {
        connect: {
          id: device.id,
        },
      },

      expiresAt: new Date(refreshTokenDecoded.exp * 1000),
    });

    return tokens;
  }
  async validateUserJWTDecoded(id: number) {
    const passed = UserResponseSchema.safeParse(await this.authRepository.findUserByEmailOrId({ id }));

    if (!passed.success) {
      this.logger.error(passed.error.format()); // để xem lỗi

      throw new UnauthorizedException('User schema invalid');
    }
    return passed.data;
  }
  async validateUserJWTRefreshDecoded(userId: number, refreshToken: string, meta: { userAgent: string; ip: string }) {
    const refreshTokenDb = await this.authRepository.findUniqueRefreshToken({ token: refreshToken });
    if (!refreshTokenDb) throw new UnauthorizedException('Refresh token đã sử dụng');
    const { deviceId } = refreshTokenDb;
    const $deleteRefreshToken = this.authRepository.deleteRefreshToken({ token: refreshToken });
    const $token = this.generateTokens({
      deviceId,
      userId,
    });

    const [, , token] = await Promise.all([$deleteRefreshToken, $deleteRefreshToken, $token]);
    const refreshTokenDecoded = await this.tokenService.verifyRefreshToken(token.refreshToken);

    await this.authRepository.createRefreshToken({
      token: (await $token).refreshToken,
      User: {
        connect: {
          id: userId,
        },
      },
      device: {
        connect: {
          id: deviceId,
        },
      },
      expiresAt: new Date(refreshTokenDecoded.exp * 1000),
    });
    return token;
  }

  async logout(refreshToken: string) {
    try {
      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({ token: refreshToken });
      await this.authRepository.updateDevice(
        {
          isActive: false,
        },
        {
          id: deletedRefreshToken.deviceId,
        },
      );
      return {
        message: 'Đăng xuất thành công',
      };
    } catch {
      throw new UnauthorizedException({
        status: 401,
        error: 'Không thể xoá refresh Token',
        message: 'Token có thể đã bị đánh cắp',
        data: null,
      });
    }
  }
}
