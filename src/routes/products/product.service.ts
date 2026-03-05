import { Injectable, Logger } from '@nestjs/common';
import { ProductCreateInput, ProductUpdateInput } from 'generated/prisma/models';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { ProductCreateBodyDTO, ProductUpdateBodyDTO } from 'src/routes/products/product.dto';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
import { omitUndefined } from 'src/shared/helpers/helpers';
import { ProductRepository } from 'src/shared/repositories/product.repository';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

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

    if (product.imagesId?.length) {
      productCreate.images = {
        connect: product.imagesId.map((id) => ({ id })),
      };
    }
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
    if (productUpdateDto.imagesId?.length) {
      productUpdate.images = {
        connect: productUpdateDto.imagesId.map((id) => ({ id })),
      };
    }
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

  async getListProduct(query: PaginationDTOQuery) {
    const code = I18nContext.current()?.lang as string;
    return this.productRepository.findAllByCustomer(query, code);
  }

  async findById(id: number) {
    const code = I18nContext.current()?.lang as string;

    return this.productRepository.findById(id, code);
  }
  async deleteProduct(productId: number, userId: number) {
    return this.productRepository.softDelete(productId, userId);
  }
  async restoreProduct(productId: number, userId: number) {
    return this.productRepository.restoreCategory(productId, userId);
  }
}
