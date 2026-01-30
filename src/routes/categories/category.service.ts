import { Injectable } from '@nestjs/common';
import { CategoryCreateInput } from 'generated/prisma/models';
import { CategoryRepository } from 'src/routes/categories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(category: CategoryCreateInput) {
    return await this.categoryRepository.create(category);
  }
}
