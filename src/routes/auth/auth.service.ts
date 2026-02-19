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
import { AccessTokenDecoded, AccessTokenPayload, RefreshTokenDecoded } from 'src/shared/constants/jwt.type';
import { isUniqueConstraintError } from 'src/shared/helpers/helpers';
import { SharedUserRepository } from 'src/shared/repositories/user.repository';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';

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
      ver: loginUser.passwordVersions || 0,
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
    const { accessToken, refreshToken } = tokens;
    return {
      email: loginUser.email,
      name: loginUser.name,
      accessToken,
      refreshToken,
    };
  }
  async validateUserJWTDecoded(accessTokenDecoded: AccessTokenDecoded) {
    const userDb = await this.authRepository.findUserByEmailOrId({ id: accessTokenDecoded.userId });
    if (!userDb) throw new UnauthorizedException('User không tồn tại');
    const userResponse = {
      id: userDb.id,
      email: userDb.email,
      passwordVersions: userDb.passwordVersions,
      roleIds: userDb.userRoles?.map((r) => r.roleId),
    };

    if (accessTokenDecoded.ver !== userDb?.passwordVersions)
      throw new UnauthorizedException('Token đã bị vô hiệu do mật khẩu thay đổi');
    const passed = UserResponseSchema.safeParse(userResponse);

    if (!passed.success) {
      this.logger.error(passed.error.format()); // để xem lỗi

      throw new UnauthorizedException('User schema invalid');
    }

    return passed.data;
  }

  async validateRefreshTokenIat(refreshToken: string): Promise<[decodedRefreshToken: RefreshTokenDecoded]> {
    const [decodedRefreshToken] = await Promise.all([this.tokenService.verifyRefreshToken(refreshToken)]);

    return [decodedRefreshToken];
  }

  async validateUserJWTRefreshDecoded(userId: number, refreshToken: string, meta: { userAgent: string; ip: string }) {
    await this.validateRefreshTokenIat(refreshToken);
    const refreshTokenDb = await this.authRepository.findUniqueRefreshToken({ token: refreshToken });
    if (!refreshTokenDb) throw new UnauthorizedException('Refresh token đã sử dụng');
    const { deviceId } = refreshTokenDb;
    const $deleteRefreshToken = this.authRepository.deleteRefreshToken({ token: refreshToken });
    const $token = this.generateTokens({
      deviceId,
      userId,
      ver: refreshTokenDb.User.passwordVersions || 0,
    });

    const [_, token] = await Promise.all([$deleteRefreshToken, $token]);
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
