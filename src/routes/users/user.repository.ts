import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { UserSelect, UserWhereUniqueInput } from 'generated/prisma/models';
import { PrismaService } from 'src/shared/services/prisma.service';

const defaultUserSafeSelect: UserSelect = {
  id: true,
  email: true,
  avatar: true,
  phoneNumber: true,
};

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByUniqueField(where: UserWhereUniqueInput, select: UserSelect = defaultUserSafeSelect) {
    return this.prismaService.user.findUnique({
      where,
      ...(select && { select }),
    });
  }

  async updatePassUser(userId: number, data: Prisma.UserUpdateInput, select: UserSelect = defaultUserSafeSelect) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { ...data, passwordVersions: { increment: 1 } },
      ...(select && { select }),
    });
  }

  async getUserRoleIds(userId: number) {
    const roles = await this.prismaService.userHasRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    return roles.map((r) => r.roleId);
  }

  async getRolesByUserId(userId: number) {
    return this.prismaService.userHasRole.findMany({
      where: { userId },
      select: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            isSystem: true,
          },
        },
      },
      orderBy: { roleId: 'asc' },
    });
  }

  async assignRoleToUser(userId: number, roleId: number) {
    return this.prismaService.userHasRole.create({
      data: { userId, roleId },
      select: { roleId: true },
    });
  }

  async removeRoleFromUser(userId: number, roleId: number) {
    return this.prismaService.userHasRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
      select: { roleId: true },
    });
  }
}
