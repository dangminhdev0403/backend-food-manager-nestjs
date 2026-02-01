import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from 'src/routes/categories/category.service';

@ApiTags('Danh mục sản phẩm')
@Controller('categories')
export class UserCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách danh mục',
    description: 'Trả về danh sách tất cả danh mục chưa bị xoá trong hệ thống.',
  })
  async getListCategory() {
    return this.categoryService.getListCategory();
  }

  @Get('get-one/:id')
  @ApiOperation({
    summary: 'Lấy chi tiết danh mục',
    description: 'Lấy thông tin chi tiết của một danh mục theo ID.',
  })
  async getCategoryDetail(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findAllByLangueId(id);
  }
}
