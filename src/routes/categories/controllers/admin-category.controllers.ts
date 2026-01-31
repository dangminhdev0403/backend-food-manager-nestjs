import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryCreateBodyDto, CategoryUpdateBodyDto } from 'src/routes/categories/category.dto';
import { CategoryService } from 'src/routes/categories/category.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';
@ApiTags('Admin quản lý Danh mục')
@Controller('admin/categories')
export class AdminCategoryController {
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

  @Post()
  @ApiOperation({
    summary: 'Tạo mới danh mục',
    description: 'Tạo một danh mục mới trong hệ thống.',
  })
  async createCategory(@Body() dto: CategoryCreateBodyDto, @Request() req: RequestLogined) {
    return this.categoryService.create(dto, req.user.id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Cập nhật danh mục',
    description: 'Cập nhật thông tin của một danh mục đã tồn tại.',
  })
  async updateCategory(@Body() dto: CategoryUpdateBodyDto, @Request() req: RequestLogined) {
    return this.categoryService.update(dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xoá danh mục',
    description: 'Thực hiện xoá mềm danh mục theo ID.',
  })
  async deleteCategory(@Param('id', ParseIntPipe) id: number, @Request() req: RequestLogined) {
    return this.categoryService.deleteCategory(id, req.user.id);
  }
  @Put(':id')
  @ApiOperation({
    summary: 'Khôi phục danh mục',
    description: 'Thực hiện Khôi phục  danh mục đã xoá.',
  })
  async restoreCategory(@Param('id', ParseIntPipe) id: number, @Request() req: RequestLogined) {
    return this.categoryService.restoreCategory(id, req.user.id);
  }
}
