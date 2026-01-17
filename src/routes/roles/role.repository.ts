import { Injectable } from '@nestjs/common';
import { RoleGetPayload } from 'generated/prisma/models';
import { RoleCreateBodyDTO, RoleUpdateBodyDTO } from 'src/routes/roles/role.dto';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
import { PageResponse } from 'src/shared/constants/response.constant';
import { RoleName } from 'src/shared/constants/role.constant';
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

  async getListRoleByUserId(
    userId: number,
    pageable: PaginationDTOQuery,
  ): Promise<PageResponse<RoleGetPayload<{ select: { id: true; name: true } }>>> {
    const { page, size } = pageable;
    const skip = (page - 1) * size;
    const take = size;

    const [items, totalItems] = await this.prismaService.$transaction([
      this.prismaService.role.findMany({
        where: {
          deletedAt: null,
          userRoles: {
            some: { userId },
          },
        },
        select: {
          id: true,
          name: true,
        },
        skip,
        take,
        orderBy: { id: 'asc' }, // ổn định kết quả phân trang
      }),

      this.prismaService.role.count({
        where: {
          deletedAt: null,
          userRoles: {
            some: { userId },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        page,
        size,
        totalItems,
        totalPages: Math.ceil(totalItems / size),
      },
    };
  }
  async createRole(dto: RoleCreateBodyDTO, userId: number) {
    const permissionIds = dto.permissionIds ?? [];

    return this.prismaService.role.create({
      data: {
        name: dto.name,
        description: dto.description,
        Permission: {
          connect: permissionIds.map((id) => ({ id })),
        },
        User_Role_createdByIdToUser: {
          connect: { id: userId },
        },
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
    const data: any = {
      updatedById: userId,
    };

    if (dto.name !== undefined && dto.name !== null) {
      data.name = dto.name;
    }
    if (dto.isActive !== undefined && dto.isActive !== null) {
      data.isActive = dto.isActive;
    }
    if (dto.description !== undefined && dto.description !== null) {
      data.description = dto.description;
    }

    if (dto.permissionIds !== undefined && dto.permissionIds !== null) {
      data.Permission = {
        set: dto.permissionIds.map((id) => ({ id })),
      };
    }

    return this.prismaService.role.update({
      where: { id: dto.id },
      data,
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
