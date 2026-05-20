import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { UserSelect } from 'generated/prisma/models';
import { RoleService } from 'src/routes/roles/role.service';
import { UserRepository } from 'src/routes/users/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
  ) {}

  async findById(userId: number, select?: UserSelect) {
    return await this.userRepository.findUserByUniqueField(
      {
        id: userId,
      },
      select,
    );
  }

  async updatePassUser(data: Prisma.UserUpdateInput, userId: number) {
    return await this.userRepository.updatePassUser(userId, data);
  }

  // async updateUserTest(userId: number, hashedPassword: string) {
  //   return await this.userRepository.updateUserTest(userId, { password: hashedPassword });
  // }
  async findUserByIdOrThrow(userId: number, select?: UserSelect) {
    const user = await this.findById(userId, select);
    if (!user)
      throw new NotFoundException({
        error: 'User not found',
        message: 'Không tìm thấy User này',
      });
    return user;
  }

  async getRolesByUserId(currentRoleIds: number[], userId: number) {
    this.roleService.blockWithNotAdminRole(currentRoleIds);
    await this.findUserByIdOrThrow(userId);

    const roles = await this.userRepository.getRolesByUserId(userId);
    return roles.map((item) => item.role);
  }

  async assignRoleToUser(currentRoleIds: number[], userId: number, roleId: number) {
    this.roleService.blockWithNotAdminRole(currentRoleIds);
    await this.findUserByIdOrThrow(userId);
    await this.roleService.blockWithSystemRole({ id: roleId }).catch(() => undefined);

    try {
      await this.userRepository.assignRoleToUser(userId, roleId);
      return this.getRolesByUserId(currentRoleIds, userId);
    } catch (error) {
      throw new BadRequestException({
        error: 'Không thể gán vai trò',
        message: 'Vai trò đã được gán hoặc dữ liệu không hợp lệ',
      });
    }
  }

  async removeRoleFromUser(currentRoleIds: number[], userId: number, roleId: number) {
    this.roleService.blockWithNotAdminRole(currentRoleIds);
    await this.findUserByIdOrThrow(userId);

    const userRoleIds = await this.userRepository.getUserRoleIds(userId);
    if (userRoleIds.length <= 1 && userRoleIds.includes(roleId)) {
      throw new ForbiddenException({
        error: 'Không thể thao tác',
        message: 'Người dùng phải có ít nhất một vai trò',
      });
    }

    try {
      await this.userRepository.removeRoleFromUser(userId, roleId);
      return this.getRolesByUserId(currentRoleIds, userId);
    } catch {
      throw new BadRequestException({
        error: 'Không thể gỡ vai trò',
        message: 'Vai trò chưa được gán cho người dùng',
      });
    }
  }
}
