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

  async findAll(pageable: PaginationDTOQuery) {
    const { page, size } = normalizePagination(pageable);
    const args = {
      where: { deletedAt: null },
      // select: { id: true, name: true, code: true },
    } satisfies Prisma.ProductFindManyArgs;

    return prismaPaginate(this.prismaService.language, args, page, size);
  }
}
