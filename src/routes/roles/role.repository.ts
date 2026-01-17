import { Injectable } from '@nestjs/common';
import { RoleCreateBodyDTO } from 'src/routes/roles/role.dto';
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

  async createRole(dto: RoleCreateBodyDTO, userId: number) {
    return this.prismaService.role.create({
      data: {
        name: dto.name,
        description: dto.description,
        Permission: {
          connect: dto.permissionIds.map((id) => ({ id })),
        },
        User_Role_createdByIdToUser: {
          connect: { id: userId },
        },
      },
    });
  }
  async getListRoleByUserId(userId: number) {
    return this.prismaService.role.findMany({
      where: {
        deletedAt: null,
        userRoles: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        deletedAt: true,
      },
    });
  }
}
