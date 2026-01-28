import { Injectable } from '@nestjs/common';
import { ProductCreateInput } from 'generated/prisma/models';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(product: ProductCreateInput) {
    return await this.prismaService.product.create({
      data: product,
    });
  }
}
