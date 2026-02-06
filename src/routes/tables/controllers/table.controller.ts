import { Controller, Get, Param } from '@nestjs/common';
import { TableService } from 'src/routes/tables/table.service';

@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get('scan/:token')
  scan(@Param('token') token: string) {
    return this.tableService.resolveByQr(token);
  }
}
