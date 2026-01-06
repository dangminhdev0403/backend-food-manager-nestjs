/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import { LoginBodyDTO } from 'src/routes/auth/auth.dto';
import { RegisterBodyType, SendOTPBodyType } from 'src/routes/auth/auth.model';
import { AuthRepository } from 'src/routes/auth/auth.repository';
import { RolesService } from 'src/routes/auth/services/roles.service';
import { envConfig, generateOTP } from 'src/shared/config';
import { isUniqueConstraintError } from 'src/shared/helpers';
import { SharedUserRepository } from 'src/shared/repositories/user.repository';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRespo: SharedUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(body: RegisterBodyType): Promise<Omit<RegisterBodyType, 'password' | 'roleId'>> {
    try {
      const verificationCode = await this.authRepository.findUniqueVerificationCode({
        email: body.email,
        code: body.code,
        type: 'REGISTER',
      });

      if (!verificationCode) {
        throw new UnprocessableEntityException([
          {
            message: 'Mã OTP không hợp lệ hoặc đã hết hạn',
            path: 'code',
          },
        ]);
      }

      const hashedPassword = await this.hashingService.hash(body.password);

      const roleId = await this.rolesService.getClientRoleId();

      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,

        roleId,
      });
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
      expiresAt: addMilliseconds(new Date(), parseInt(ms(envConfig.OTP_EXPIRES_IN))), // 5 minutes from now
    });
    return verificationCode;
  }

  async generateTokens(payload: AccessTokenPayload) {
    return await this.tokenService.generateToken(payload);
  }

  async login(body: LoginBodyDTO, meta: { userAgent: string; ip: string }) {
    const loginUser = await this.authRepository.findUniqueUserIncludeRole({
      email: body.email,
    });
    if (!loginUser) throw new UnauthorizedException();
    const isPassMatch = await this.hashingService.compare(body.password, loginUser.password);
    if (!isPassMatch) {
      throw new UnauthorizedException();
    }
    const device = await this.authRepository.createDevice({
      userId: loginUser.id,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
    const tokens = await this.generateTokens({
      userId: loginUser.id,
      deviceId: loginUser.id,
      roleId: loginUser.roleId,
      roleName: loginUser.Role_User_roleIdToRole.name,
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
}
