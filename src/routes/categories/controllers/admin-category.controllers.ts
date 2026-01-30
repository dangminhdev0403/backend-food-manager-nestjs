import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from 'src/routes/categories/category.service';
import { AuthorizationGuard } from 'src/shared/guard/authorization.guard';

@ApiTags('Admin quản lí Danh mục ')
@UseGuards(AuthorizationGuard)
@Controller('admin/categories')
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}
}
