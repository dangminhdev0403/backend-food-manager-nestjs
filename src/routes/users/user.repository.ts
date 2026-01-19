import { Injectable } from '@nestjs/common';
import { UserSelect, UserUpdateInput, UserWhereUniqueInput } from 'generated/prisma/models';
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

  async updateUser(data: UserUpdateInput, userId: number, select: UserSelect = defaultUserSafeSelect) {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data,
      ...(select && { select }),
    });
  }
}
