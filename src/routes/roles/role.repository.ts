import { Injectable } from '@nestjs/common';
import { RoleGetPayload } from 'generated/prisma/models';
import { RoleCreateBodyDTO, RoleUpdateBodyDTO } from 'src/routes/roles/role.dto';
import { envConfig } from 'src/shared/config/env.config';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
import { PageResponse } from 'src/shared/constants/response.constant';
import { RoleName } from 'src/shared/constants/role.constant';
import { normalizePagination, prismaPaginate } from 'src/shared/helpers/pagination.helpers';

import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getClientRoleId(clientRoleId: number | null) {
    if (clientRoleId == null) {
      const role = await this.prismaService.role.findUniqueOrThrow({
        where: {
          name: RoleName.Client,
        },
      });
      clientRoleId = role.id;
    }

    return clientRoleId;
  }

  isUserAdmin(roleIds: number[]) {
    return roleIds.includes(Number.parseInt(envConfig.ADMIN_ID));
  }

  async getListRoleByUserId(
    userId: number,
    roleIds: number[],
    pageable: PaginationDTOQuery,
  ): Promise<PageResponse<RoleGetPayload<{ select: { id: true; name: true } }>>> {
    const { page, size } = normalizePagination(pageable);
    const isAdmin = this.isUserAdmin(roleIds);

    const where: any = { deletedAt: null };

    if (!isAdmin) {
      where.userRoles = { some: { userId } };
    }

    return prismaPaginate(
      this.prismaService.role,
      {
        where,
        select: { id: true, name: true },
        orderBy: { id: 'asc' },
      },
      page,
      size,
    );
  }

  async createRole(dto: RoleCreateBodyDTO, userId: number) {
    const permissionIds = dto.permissionIds ?? [];

    return this.prismaService.role.create({
      data: {
        name: dto.name,
        description: dto.description,
        permissions: {
          create: permissionIds.map((id) => ({
            permissionId: id,
          })),
        },
        User_Role_createdByIdToUser: {
          connect: { id: userId },
        },
      },
      omit: {
        isActive: true,
        createdById: true,
        updatedById: true,
        deletedAt: true,
        updatedAt: true,
      },
    });
  }
  async findSystemRole(roleId: number) {
    return await this.prismaService.role.findUniqueOrThrow({
      where: {
        id: roleId,
      },
      select: {
        isSystem: true,
      },
    });
  }
  async updateRole(userId: number, dto: RoleUpdateBodyDTO) {
    const updateData: any = {
      updatedById: userId,
    };

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.description !== undefined) updateData.description = dto.description;

    return this.prismaService.$transaction(async (tx) => {
      // 1. Update role basic fields
      const updatedRole = await tx.role.update({
        where: { id: dto.id },
        data: updateData,
      });

      // 2. Add permissions
      if (dto.addPermissionIds?.length) {
        await tx.rolePermission.createMany({
          data: dto.addPermissionIds.map((pid) => ({
            roleId: dto.id,
            permissionId: pid,
          })),
          skipDuplicates: true,
        });
      }

      // 3. Remove permissions
      if (dto.removePermissionIds?.length) {
        await tx.rolePermission.deleteMany({
          where: {
            roleId: dto.id,
            permissionId: { in: dto.removePermissionIds },
          },
        });
      }

      // 4. Return updated + full permission list
      return tx.role.findUnique({
        where: { id: dto.id },
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          permissions: {
            select: {
              permission: {
                select: {
                  id: true,
                  name: true,
                  module: true,
                },
              },
            },
          },
        },
      });
    });
  }

  async deleteRole(userId: number, dto: RoleUpdateBodyDTO) {
    const data: any = {
      updatedById: userId,
    };

    return this.prismaService.role.update({
      where: { id: dto.id },
      data: {
        ...data,

        deletedAt: new Date(),
      },
    });
  }
}
