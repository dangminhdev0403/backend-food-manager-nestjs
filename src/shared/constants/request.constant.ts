import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PaginationZodQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),

  // ⚠ max size để tránh full table scan / DOS
  size: z.coerce.number().int().min(1).max(100).default(20),
});

export class PaginationDTOQuery extends createZodDto(PaginationZodQuery) {}
