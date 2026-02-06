import { z } from 'zod';

interface ItemBody {
  productId: number;
  quantity: 2;
}
export const OrderBodyBase = z
  .object({
    tableId: z.number().int().positive(),
  })
  .strict();

export const CreateGuestOrderBodySchema = OrderBodyBase.extend({
  guestName: z.string(),
}).strict();

export const UpdateGuestOrderBodySchema = CreateGuestOrderBodySchema;

export const CreateUserOrderBodySchema = OrderBodyBase;
export const UpdateUserOrderBodySchema = OrderBodyBase;

export const AddItemOrderBodySchema = z
  .object({
    orderId: z.number().int().positive(),
    items: z
      .array(
        z.object({
          productId: z.number().int().positive(),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1),
  })
  .strict();
export const UpdateItemOrderBodySchema = AddItemOrderBodySchema;
export type UpdateGuestOrderBodyType = z.infer<typeof UpdateGuestOrderBodySchema>;
export type CreateGuestOrderBodyType = z.infer<typeof CreateGuestOrderBodySchema>;
export type UpdateUserOrderBodyType = z.infer<typeof UpdateUserOrderBodySchema>;
export type CreateUserOrderBodyType = z.infer<typeof CreateUserOrderBodySchema>;
export type AddItemOrderBodyType = z.infer<typeof AddItemOrderBodySchema>;
export type UpdateItemOrderBodyType = z.infer<typeof UpdateItemOrderBodySchema>;
