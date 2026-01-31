import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { CategoryCreateBodyDto, CategoryUpdateBodyDto } from 'src/routes/categories/category.dto';
import { CategoryRepository } from 'src/routes/categories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(category: CategoryCreateBodyDto, userId: number) {
    return await this.categoryRepository.create(category, userId);
  }

  async findAllByLangueId(categoryId: number) {
    const categoryDb = await this.categoryRepository.findOneForUpdate(categoryId);
    if (!categoryDb) {
      throw new NotFoundException({
        message: 'Category not found',
        error: 'NOT_FOUND',
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
}
