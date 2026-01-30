import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Danh mục sản phẩm')
@Controller('categories')
export class UserCategoryController {}
