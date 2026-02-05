import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductCreateBodyDTO, ProductUpdateBodyDTO } from 'src/routes/products/product.dto';
import { ProductService } from 'src/routes/products/product.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
import { AuthorizationGuard } from 'src/shared/guard/authorization.guard';

@ApiTags('Admin Quản lí sản phẩm')
@Controller('admin/products')
@UseGuards(AuthorizationGuard)
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo món ăn',
    description: 'Tạo mới một món ăn ',
  })
  async createProduct(@Body() productInput: ProductCreateBodyDTO, @Request() req: RequestLogined) {
    return this.productService.createProduct(productInput, req.user.id);
  }
  @Put()
  @ApiOperation({
    summary: 'Cập nhật món ăn',
    description: 'Cập nhật  một món ăn ',
  })
  async updateProduct(@Body() productInput: ProductUpdateBodyDTO, @Request() req: RequestLogined) {
    return this.productService.updateProduct(productInput, req.user.id);
  }
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách món ăn',
    description: 'Lấy danh sách  một món ăn ',
  })
  async getListProduct(@Query() query: PaginationDTOQuery) {
    return this.productService.getListProduct(query);
  }

  @Get('get-one/:id')
  @ApiOperation({
    summary: 'Xoá món ăn',
    description: 'Thực hiện xoá mềm món ăn theo ID.',
  })
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }
  @Delete(':id')
  @ApiOperation({
    summary: 'Xoá món ăn',
    description: 'Thực hiện xoá mềm món ăn theo ID.',
  })
  async deleteCategory(@Param('id', ParseIntPipe) id: number, @Request() req: RequestLogined) {
    return this.productService.deleteProduct(id, req.user.id);
  }
  @Put(':id')
  @ApiOperation({
    summary: 'Khôi phục món ăn',
    description: 'Thực hiện Khôi phục  món ăn đã xoá.',
  })
  async restoreCategory(@Param('id', ParseIntPipe) id: number, @Request() req: RequestLogined) {
    return this.productService.restoreProduct(id, req.user.id);
  }
}
