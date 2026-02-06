import { createZodDto } from 'nestjs-zod';
import { TableCreateBodySchema } from 'src/routes/tables/table.model';

export class TableCreateBodyDTO extends createZodDto(TableCreateBodySchema) {}
