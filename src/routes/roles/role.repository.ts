import { Injectable } from '@nestjs/common';
import { RoleName } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) { }


     async getClientRoleId(clientRoleId: number | null ) {
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
  
}
