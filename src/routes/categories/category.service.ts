import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CategoryCreateBodyDto, CategoryUpdateBodyDto } from 'src/routes/categories/category.dto';
import { CategoryRepository } from 'src/routes/categories/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async create(category: CategoryCreateBodyDto, userId: number) {
    return await this.categoryRepository.create(category, userId);
  }

  async findAllByLangueId(categoryId: number) {
    const code = I18nContext.current()?.lang as string;

    const categoryDb = await this.categoryRepository.findOneForUpdate(categoryId, code);
    if (!categoryDb) {
      throw new NotFoundException({
        message: 'Category not found',
        error: this.i18n.t('exceptionHandler.NOT_FOUND'),
      });
    }
    return categoryDb;
  }
  async update(category: CategoryUpdateBodyDto, userId: number) {
    return await this.categoryRepository.update(category, userId);
  }

  async getListCategory() {
    const code = I18nContext.current()?.lang as string;
    return this.categoryRepository.findAll(code);
  }
  async deleteCategory(categoryId: number, userId: number) {
    return this.categoryRepository.softDelete(categoryId, userId);
  }
  async restoreCategory(categoryId: number, userId: number) {
    return this.categoryRepository.restoreCategory(categoryId, userId);
  }
}
