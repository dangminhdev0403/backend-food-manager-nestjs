import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const PaginationZodQuery = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).default(20),
});

export class PaginationDTOQuery extends createZodDto(PaginationZodQuery) {}
