/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterBodyDTO } from 'src/routes/auth/auth.dto';
import { RolesService } from 'src/routes/auth/services/roles.service';
import { isUniqueConstraintError } from 'src/shared/helpers';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly prismaService: PrismaService,
  ) {}

  async registerUser(body: RegisterBodyDTO) {
    const hashedPassword = await this.hashingService.hash(body.password);
    try {
      const roleId = await this.rolesService.getClientRoleId();
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
          roleId: roleId,
          phoneNumber: body.phoneNumber,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          password: false,
        },
      });
      return user;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }
}
