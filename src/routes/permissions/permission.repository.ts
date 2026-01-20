import { Injectable } from '@nestjs/common';
import { HTTPMethod } from 'generated/prisma/enums';
import { envConfig } from 'src/shared/config/env.config';
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

  async hasPermission(roleIds: number[], path: string, method: HTTPMethod): Promise<boolean> {
    if (roleIds.length === 0) return false;

    // admin bypass
    if (roleIds.includes(1)) return true;

    const permission = await this.prismaService.permission.findFirst({
      where: {
        method,
        path,
        roles: {
          some: {
            roleId: { in: roleIds },
          },
        },
      },
      select: { id: true },
    });

    return !!permission;
  }
}
