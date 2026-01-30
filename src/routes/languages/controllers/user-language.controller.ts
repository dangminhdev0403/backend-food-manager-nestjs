import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguageService } from 'src/routes/languages/language.service';

@Controller('languages')
@ApiTags(' Ngôn ngữ ')
export class UserLanguagesController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách ngôn ngữ',
    description: 'Lấy danh sách ngôn ngữ trong hệ thông ',
  })
  async getListLanguage() {
    return this.languageService.findAll();
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
