import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TableCreateBodyDTO } from 'src/routes/tables/table.dto';
import { TableService } from 'src/routes/tables/table.service';
import { AuthorizationGuard } from 'src/shared/guard/authorization.guard';
@ApiTags('Admin Quản lí bàn ăn')
@Controller('/admin/tables')
@UseGuards(AuthorizationGuard)
export class AdminTableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  async createTable(@Body() tableData: TableCreateBodyDTO) {
    return this.tableService.createTable(tableData);
  }
  @Get()
  async getListTable() {
    return this.tableService.getListTable();
  }
}
