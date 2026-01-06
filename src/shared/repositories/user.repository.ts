import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findUnique(uniqueObject: Prisma.UserWhereUniqueInput): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
    });
  }
}
