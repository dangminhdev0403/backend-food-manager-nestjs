import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TableCreateBodyDTO, TableFilterBodyDTO } from 'src/routes/tables/table.dto';
import { TableService } from 'src/routes/tables/table.service';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';
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
  async getListTable(@Query() query: PaginationDTOQuery & TableFilterBodyDTO) {
    return this.tableService.getListTable(query);
  }
  @Get('status-count')
  async getTableStatus() {
    return this.tableService.getTableStatusCounts();
  }
}
