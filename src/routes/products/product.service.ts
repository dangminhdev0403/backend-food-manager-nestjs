import { Injectable, Logger } from '@nestjs/common';
import { ProductCreateInput, ProductUpdateInput } from 'generated/prisma/models';
import { ProductCreateBodyDTO, ProductUpdateBodyDTO } from 'src/routes/products/product.dto';
import { omitUndefined } from 'src/shared/helpers/helpers';
import { ProductRepository } from 'src/shared/repositories/product.repository';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(product: ProductCreateBodyDTO, ownerId: number) {
    const productCreate: ProductCreateInput = {
      basePrice: product.basePrice,
      virtualPrice: product.virtualPrice,
      Category: {
        connect: {
          id: product.categoryId,
        },
      },
      createdBy: {
        connect: { id: ownerId },
      },
      owner: {
        connect: { id: ownerId },
      },

      ProductTranslation: {
        create: product.translations.map((t) => ({
          name: t.name,
          description: t.description,
          cookingInstructions: t.cookingInstructions,
          Language: {
            connect: {
              id: t.languageId,
            },
          },
        })),
      },
    };

    return await this.productRepository.createProduct(productCreate);
  }
  async updateProduct(productUpdateDto: ProductUpdateBodyDTO, ownerId: number) {
    const productUpdate: ProductUpdateInput = omitUndefined({
      basePrice: productUpdateDto.basePrice,
      virtualPrice: productUpdateDto.virtualPrice,
      Category: {
        connect: {
          id: productUpdateDto.categoryId,
        },
      },
      updatedBy: {
        connect: {
          id: ownerId,
        },
      },
    });
    if (productUpdateDto.translations) {
      productUpdate.ProductTranslation = {
        upsert: productUpdateDto.translations.map((t) => ({
          where: {
            product_language_unique: {
              languageId: t.languageId,
              productId: productUpdateDto.id,
            },
          },
          update: {
            name: t.name,
            description: t.description,
            cookingInstructions: t.cookingInstructions,
          },
          create: {
            name: t.name,
            description: t.description,
            cookingInstructions: t.cookingInstructions,
            Language: { connect: { id: t.languageId } },
          },
        })),
      };
    }
    return await this.productRepository.updateProduct(productUpdateDto.id, productUpdate);
  }
}
