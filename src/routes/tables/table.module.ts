import { Module } from '@nestjs/common';
import { PermissionModule } from 'src/routes/permissions/permission.module';
import { AdminTableController } from 'src/routes/tables/controllers/admin-table.controller';
import { TableController } from 'src/routes/tables/controllers/table.controller';
import { TableRepository } from 'src/routes/tables/table.repository';
import { TableService } from './table.service';

@Module({
  imports: [PermissionModule],
  controllers: [TableController, AdminTableController],
  providers: [TableService, TableRepository],
})
export class TableModule {}
