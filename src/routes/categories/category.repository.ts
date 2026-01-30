import { Injectable } from '@nestjs/common';
import { CategoryCreateInput } from 'generated/prisma/models';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(category: CategoryCreateInput) {
    return await this.prismaService.category.create({
      data: category,
    });
  }
}
