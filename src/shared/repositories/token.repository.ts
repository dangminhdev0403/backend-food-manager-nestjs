import { Injectable } from '@nestjs/common';
import { Prisma, RefreshToken } from 'generated/prisma/client';
import { DeviceType } from 'src/routes/auth/auth.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class SharedTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

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
