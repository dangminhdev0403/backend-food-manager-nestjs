import { TableCreateInputObjectZodSchema } from 'generated/zod-validator/schemas';
import z from 'zod';

export enum TableStatus {
  ALL = 'ALL',
  EMPTY = 'EMPTY',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
}
export const BaseTableSchema = TableCreateInputObjectZodSchema.pick({
  name: true,
  capacity: true,
});
export const TabeFilterBodySchema = z
  .object({
    search: z.string().default(''),
    statusFilter: z.enum(TableStatus).default(TableStatus.ALL),
  })
  .strict();
export const TableCreateBodySchema = BaseTableSchema.strict();

export type TabeFilterBodySchemaType = z.infer<typeof TabeFilterBodySchema>;
