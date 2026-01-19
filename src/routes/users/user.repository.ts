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
  
}
