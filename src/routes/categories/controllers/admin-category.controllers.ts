import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryCreateBodyDto, CategoryUpdateBodyDto } from 'src/routes/categories/category.dto';
import { CategoryService } from 'src/routes/categories/category.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';

@ApiTags('Admin quản lí Danh mục ')
// @UseGuards(AuthorizationGuard)
@Controller('admin/categories')
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getListCategory() {
    return this.categoryService.getListCategory();
  }
  @Get('get-one/:id')
  async getCategoryDetail(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findAllByLangueId(id);
  }

  @Post()
  async createCategory(@Body() dto: CategoryCreateBodyDto, @Request() req: RequestLogined) {
    return this.categoryService.create(dto, req.user.id);
  }
  @Patch()
  async updateCategory(@Body() dto: CategoryUpdateBodyDto, @Request() req: RequestLogined) {
    return this.categoryService.update(dto, req.user.id);
  }
}
