import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getListPermissionGroupedList() {
    return await this.prismaService.permission.findMany({
      omit: {
        createdAt: true,
        updatedAt: true,
        method: true,
        path: true,
      },
    });
  }

  async getPermissionByRoleId(roleId: number) {
    return this.prismaService.permission.findMany({
      where: {
        roles: {
          some: {
            role: {
              id: roleId,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        module: true,
      },
    });
  }
}
