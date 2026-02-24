import { createZodDto } from 'nestjs-zod';
import { TabeFilterBodySchema, TableCreateBodySchema, TableUpdateBodySchema } from 'src/routes/tables/table.model';

export class TableCreateBodyDTO extends createZodDto(TableCreateBodySchema) {}
export class TableUpdateBodyDTO extends createZodDto(TableUpdateBodySchema) {}
export class TableFilterBodyDTO extends createZodDto(TabeFilterBodySchema) {}
