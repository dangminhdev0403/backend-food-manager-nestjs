import { z } from 'zod';

export const CreateOrderSchema = {
  languageId: z.number().int().positive(),
};
