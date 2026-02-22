import { createZodDto } from 'nestjs-zod';
import { TabeFilterBodySchema, TableCreateBodySchema } from 'src/routes/tables/table.model';

export class TableCreateBodyDTO extends createZodDto(TableCreateBodySchema) {}
export class TableFilterBodyDTO extends createZodDto(TabeFilterBodySchema) {}
