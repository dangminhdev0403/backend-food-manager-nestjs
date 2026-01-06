import { Injectable } from '@nestjs/common';
import { RefreshToken } from 'generated/prisma/browser';
import { Prisma } from 'generated/prisma/client';
import { DeviceType, RegisterBodyType, RoleType, VerifyCationCodeType } from 'src/routes/auth/auth.model';
import { TypeOfVerficationCodeType } from 'src/shared/constants/auth.constant';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true,
      },
    });
  }

  async createVerìficationCode(
    payload: Pick<VerifyCationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>,
  ): Promise<VerifyCationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email: payload.email,
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
    });
  }

  async findUniqueVerificationCode(
    uniqueValue:
      | { email: string }
      | { id: number }
      | {
          email: string;
          code: string;
          type: TypeOfVerficationCodeType;
        },
  ): Promise<VerifyCationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: uniqueValue,
    });
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>,
  ) {
    return this.prismaService.device.create({
      data,
    });
  }

  async createRefreshToken(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken> {
    return this.prismaService.refreshToken.create({ data });
  }
  // async findUniqueUserIncludeRole(uniqueObject: { email: string } | { id: number }): Promise<UserType | null> {
  //   return this.prismaService.user.findUnique({
  //     where: uniqueObject,
  //     include: {
  //       Role_User_roleIdToRole: true,
  //     },
  //   });
  // }

  async findUniqueUserIncludeRole(
    where: { email: string } | { id: number },
  ): Promise<(UserType & { Role_User_roleIdToRole: RoleType }) | null> {
    return this.prismaService.user.findUnique({
      where,
      include: {
        Role_User_roleIdToRole: true,
      },
    });
  }
}
