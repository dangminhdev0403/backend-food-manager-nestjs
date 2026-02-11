import { TableCreateInputObjectZodSchema } from "generated/zod-validator/schemas";

export const BaseTableSchema = TableCreateInputObjectZodSchema.pick({
  name: true,
  capacity:true,
});

export const TableCreateBodySchema = BaseTableSchema.strict();