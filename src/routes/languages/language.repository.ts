import { Injectable } from '@nestjs/common';
import { LanguageCreateInput, LanguageUncheckedUpdateInput } from 'generated/prisma/models';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class LanguageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.language.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  }
  async createOne(languageInput: LanguageCreateInput) {
    return this.prismaService.language.create({
      data: languageInput,
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  }
  async updateOne(languageInput: LanguageUncheckedUpdateInput, userId: number) {
    if (languageInput.id) {
      const { id, ...data } = languageInput;
      const idUpdate = typeof id === 'number' ? id : id?.set;
      return this.prismaService.language.update({
        where: { id: idUpdate },
        data: {
          ...data,
          updatedById: userId, // ✅ raw FK
        },
      });
    } else {
      throw new Error('id không được để trống');
    }
  }

  async findById(id: number) {
    return this.prismaService.language.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        code: true,
        createdAt: true,
      },
    });
  }

  async hardDelete(id: number) {
    return this.prismaService.language.delete({
      where: {
        id,
      },
    });
  }
  async softDelete(id: number, userId: number) {
    return this.prismaService.language.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        User_Language_updatedByIdToUser: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
  async restoreDelete(id: number, userId: number) {
    return this.prismaService.language.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
        User_Language_updatedByIdToUser: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
