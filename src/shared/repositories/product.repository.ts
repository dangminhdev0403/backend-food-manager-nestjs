import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { ProductCreateInput, ProductUpdateInput } from 'generated/prisma/models';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
import { normalizePagination, prismaPaginate } from 'src/shared/helpers/pagination.helpers';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(product: ProductCreateInput) {
    return await this.prismaService.product.create({
      data: product,
      select: {
        id: true,
        basePrice: true,
        virtualPrice: true,
        Category: {
          select: {
            id: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
        ProductTranslation: {
          select: {
            Language: {
              select: {
                code: true,
              },
            },
            name: true,
            cookingInstructions: true,
            description: true,
          },
        },
      },
    });
  }
  async updateProduct(productId: number, product: ProductUpdateInput) {
    return await this.prismaService.product.update({
      where: {
        id: productId,
        deletedAt: null,
      },
      data: product,
      select: {
        id: true,
        basePrice: true,
        virtualPrice: true,
        Category: {
          select: {
            id: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
        ProductTranslation: {
          select: {
            Language: {
              select: {
                code: true,
              },
            },
            name: true,
            cookingInstructions: true,
            description: true,
          },
        },
      },
    });
  }

  async findAll(pageable: PaginationDTOQuery, code: string) {
    const { page, size } = normalizePagination(pageable);
    const args = {
      where: {
        deletedAt: null,
        ProductTranslation: {
          some: {
            Language: { code },
          },
        },
      },
      select: {
        id: true,
        basePrice: true,
        virtualPrice: true,
        ProductTranslation: {
          select: {
            name: true,
            description: true,
            cookingInstructions: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
      },
    } satisfies Prisma.ProductFindManyArgs;

    return prismaPaginate(this.prismaService.product, args, page, size);
  }

  async findAllByCustomer(pageable: PaginationDTOQuery, code: string) {
    const { page, size } = normalizePagination(pageable);
    const args = {
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        basePrice: true,
        virtualPrice: true,
        ProductTranslation: {
          where: {
            Language: {
              code,
            },
          },
          select: {
            name: true,
            description: true,
            cookingInstructions: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
      },
    } satisfies Prisma.ProductFindManyArgs;
      const { items, meta } = await prismaPaginate(this.prismaService.product, args, page, size);

     const normalized = items.map((item) => ({
       id: item.id,
       basePrice: item.basePrice,
       virtualPrice: item.virtualPrice,
       name: item.ProductTranslation[0]?.name ?? null,
       description: item.ProductTranslation[0]?.description ?? null,
       cookingInstructions: item.ProductTranslation[0]?.cookingInstructions ?? null,
       images: item.images.map((img) => img.url),
     }));
     return {
       items: normalized,
       meta,
     };
  }

  async findById(id: number, code: string) {
    return this.prismaService.product.findFirst({
      where: {
        id,
        ProductTranslation: {
          some: {
            Language: {
              code,
            },
          },
        },
      },
      select: {
        id: true,
        basePrice: true,
        virtualPrice: true,
        Category: true,
        ProductTranslation: {
          select: {
            name: true,
            cookingInstructions: true,
          },
        },
      },
    });
  }
  async softDelete(productId: number, userId: number) {
    return this.prismaService.product.update({
      where: {
        id: productId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedById: userId,
      },
    });
  }
  async restoreCategory(categoryId: number, userId: number) {
    return this.prismaService.product.update({
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
