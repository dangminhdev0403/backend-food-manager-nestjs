import { Module } from '@nestjs/common';
import { CategoryRepository } from 'src/routes/categories/category.repository';
import { CategoryService } from 'src/routes/categories/category.service';
import { AdminCategoryController } from 'src/routes/categories/controllers/admin-category.controllers';
import { PermissionModule } from 'src/routes/permissions/permission.module';
import { UserCategoryController } from './controllers/user-category.controllers';

@Module({
  imports: [PermissionModule],
  controllers: [UserCategoryController, AdminCategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
