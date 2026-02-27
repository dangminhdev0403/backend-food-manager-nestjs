import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TableService } from 'src/routes/tables/table.service';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';

@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get('scan/:token')
  scan(@Param('token') token: string) {
    return this.tableService.resolveByQr(token);
  }
  @Get('list')
  geListTable(@Query() query: PaginationDTOQuery) {
    return this.tableService.customerGetListTable(query);
  }
  @Get('detail/:id')
  getDetailTable(@Param('id', ParseIntPipe) id: number) {
    return this.tableService.findTableById(id);
  }
}
