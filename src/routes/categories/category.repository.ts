import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryType, UpdateCategoryType } from 'src/routes/categories/category.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(code: string) {
    return this.prismaService.category.findMany({
      where: {
        deletedAt: null,
        translations: {
          some: {
            Language: { code },
          },
        },
      },
      select: {
        id: true,
        translations: {
          where: {
            Language: { code },
          },
          select: {
            name: true,
            description: true,
            Language: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });
  }

  async findOneForUpdate(id: number, code: string) {
    return this.prismaService.category.findUnique({
      where: {
        id,
        deletedAt: null,
        translations: {
          some: {
            Language: { code },
          },
        },
      },
      select: {
        id: true,

        createdById: true,
        updatedById: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          select: {
            languageId: true,
            name: true,
            description: true,
            Language: {
              select: {
                code: true,
                name: true,
              },
            },
          },
          orderBy: {
            languageId: 'asc',
          },
        },
      },
    });
  }

  async create(dto: CreateCategoryType, userId: number) {
    return this.prismaService.category.create({
      data: {
        createdById: userId,
        translations: {
          create: dto.translations.map((t) => ({
            languageId: t.languageId,
            name: t.name,
            description: t.description,
          })),
        },
      },
      select: {
        translations: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });
  }

  async update(dto: UpdateCategoryType, userId) {
    Logger.debug(dto);
    return this.prismaService.category.update({
      where: {
        deletedAt: null,
        id: dto.categoryId,
      },
      data: {
        translations: {
          updateMany: dto.translations.map((t) => ({
            where: {
              categoryId: dto.categoryId,
              languageId: t.languageId,
            },
            data: {
              ...(t.name && { name: t.name }),
              ...(t.description && { description: t.description }),
              updatedById: userId,
            },
          })),
        },
        updatedById: userId,
      },
    });
  }

  async softDelete(categoryId: number, userId: number) {
    return this.prismaService.category.update({
      where: {
        deletedAt: null,
        id: categoryId,
      },
      data: {
        deletedAt: new Date(),
        updatedById: userId,
      },
    });
  }
  async restoreCategory(categoryId: number, userId: number) {
    return this.prismaService.category.update({
      where: {
        id: categoryId,
      },
      data: {
        deletedAt: null,
        updatedById: userId,
      },
    });
  }
}
