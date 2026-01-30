import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguageService } from 'src/routes/languages/language.service';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';

@Controller('languages')
@ApiTags(' Ngôn ngữ ')
export class UserLanguagesController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách ngôn ngữ',
    description: 'Lấy danh sách ngôn ngữ trong hệ thông ',
  })
  async getListLanguage( @Query() query: PaginationDTOQuery) {
    return this.languageService.findAll(query);
  }
  @Get('get-one/:id')
  @ApiOperation({
    summary: 'Lấy ngôn ngữ theo ID',
    description: 'Lấy ngôn ngữ theo ID trong hệ thông ',
  })
  async getLanguage(@Param('id', ParseIntPipe) id: number) {
    return this.languageService.findById(id);
  }
}
