import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguageCreateBodyDTO, LanguageDeleteBodyDTO, LanguageUpdateBodyDTO } from 'src/routes/languages/language.dto';
import { LanguageService } from 'src/routes/languages/language.service';
import { RequestLogined } from 'src/shared/constants/auth.constant';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
import { AuthorizationGuard } from 'src/shared/guard/authorization.guard';

@Controller('admin/languages')
@ApiTags('Admin quản lí ngôn ngữ ')
@UseGuards(AuthorizationGuard)
export class AdminLanguagesController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo ngôn ngữ',
    description: 'Tạo mới một ngôn ngữ trong hệ thống ',
  })
  async createLanguage(@Body() languageInput: LanguageCreateBodyDTO, @Request() req: RequestLogined) {
    return this.languageService.createOne(languageInput, req.user.id);
  }
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách ngôn ngữ',
    description: 'Lấy danh sách ngôn ngữ trong hệ thông ',
  })
  async getListLanguage(@Query() query: PaginationDTOQuery) {
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
  @Delete()
  @ApiOperation({
    summary: 'Xoá ngôn ngữ theo ID',
    description: 'Xoá ngôn ngữ  trong hệ thông ',
  })
  async deleteLanguage(@Body() languageDeleteBodyDTO: LanguageDeleteBodyDTO, @Request() req: RequestLogined) {
    return this.languageService.delete(languageDeleteBodyDTO, req.user.id);
  }

  @Put()
  @ApiOperation({
    summary: 'Cập nhật ngôn ngữ',
    description: 'Cập nhật ngôn ngữ  trong hệ thông ',
  })
  async updateLanguage(@Body() body: LanguageUpdateBodyDTO, @Request() req: RequestLogined) {
    return this.languageService.updateOne(body, req.user.id);
  }
  @Put('restore')
  @ApiOperation({
    summary: 'Khôi phục  ngôn ngữ xoá mềm',
    description: 'Khôi phục  ngôn ngữ xoá mềm  trong hệ thông ',
  })
  async restoreLanguage(@Body() body: LanguageUpdateBodyDTO, @Request() req: RequestLogined) {
    return this.languageService.restore(body, req.user.id);
  }
}
