import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { UserSelect, UserUpdateInput } from 'generated/prisma/models';
import { UserRepository } from 'src/routes/users/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(userId: number, select?: UserSelect) {
    return await this.userRepository.findUserByUniqueField(
      {
        id: userId,
      },
      select,
    );
  }

  async updateUser(data: Prisma.UserUpdateInput, userId: number) {
    return await this.userRepository.updateUser(userId,data);
  }

  async findUserByIdOrThrow(userId: number, select?: UserSelect) {
    const user = await this.findById(userId, select);
    if (!user)
      throw new NotFoundException({
        error: 'User not found',
        message: 'Không tìm thấy User này',
      });
    return user;
  }
}
