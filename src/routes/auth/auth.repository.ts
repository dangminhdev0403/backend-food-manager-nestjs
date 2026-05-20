import { Injectable } from '@nestjs/common';

import { DeviceType, RegisterBodyType, VerifyCationCodeType } from 'src/routes/auth/auth.model';
import { TypeOfVerficationCodeType } from 'src/shared/constants/auth.constant';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Prisma, RefreshToken } from '../../../generated/prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    user: Omit<RegisterBodyType, 'confirmPassword' | 'code'>,
    roleId: number,
  ): Promise<
    Omit<
      UserType,
      | 'password'
      | 'totpSecret'
      | 'avatar'
      | 'createdAt'
      | 'createdById'
      | 'deletedAt'
      | 'updatedAt'
      | 'id'
      | 'status'
      | 'updatedById'
    >
  > {
    return this.prismaService.user.create({
      data: {
        ...user,
        userRoles: {
          create: {
            roleId,
          },
        },
      },
      omit: {
        password: true,
        totpSecret: true,
        avatar: true,
        createdAt: true,
        createdById: true,
        deletedAt: true,
        updatedAt: true,
        updatedById: true,
        id: true,
        status: true,
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
  async findUniqueUserIncludeRole(where: { email: string } | { id: number }) {
    return this.prismaService.user.findUnique({
      where,

      include: {
        userRoles: {
          select: {
            user: {
              select: {
                passwordVersions: true,
              },
            },
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findUserByEmailOrId(
    where:
      | { email: string }
      | {
          id: number;
        },
  ) {
    return this.prismaService.user.findUnique({
      where,
      select: {
        id: true,
        email: true,
        password: true,
        passwordVersions: true,
        userRoles: {
          select: {
            roleId: true,
          },
        },
      },
    });
  }
  async findUniqueRefreshToken(where: Prisma.RefreshTokenWhereUniqueInput) {
    return await this.prismaService.refreshToken.findUnique({
      where,
      select: {
        expiresAt: true,
        deviceId: true,
        User: {
          select: {
            id: true,
            userRoles: true,
            passwordVersions: true,
          },
        },
        token: true,
      },
    });
  }

  async updateDevice(data: Partial<DeviceType>, deviceId: Pick<Prisma.DeviceWhereUniqueInput, 'id'>) {
    return await this.prismaService.device.update({
      data,
      where: deviceId,
    });
  }
  async deleteRefreshToken(token: Pick<Prisma.RefreshTokenWhereUniqueInput, 'token'>) {
    return await this.prismaService.refreshToken.delete({
      where: token,
    });
  }
}
