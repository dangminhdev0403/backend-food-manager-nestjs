import { Injectable, Logger } from '@nestjs/common';
import { ProductCreateInput } from 'generated/prisma/models';
import { ProductCreateBodyDTO } from 'src/routes/products/product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(product: ProductCreateBodyDTO, ownerId: number) {
    const productCreate: ProductCreateInput = {
      basePrice: product.basePrice,
      virtualPrice: product.virtualPrice,
    
      owner: {
        connect: {
          id: ownerId,
        },
      },
    };
    return await this.productRepository.createProduct(productCreate);
  }
}
