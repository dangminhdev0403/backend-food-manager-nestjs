import { z } from 'zod';

export const ActionItem = { DECREASE: 'DECREASE', INCREASE: 'INCREASE' } as const;

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

export const ChooseItemOrderBodySchema = z
  .object({
    orderId: z.number().int().positive(),
    // type: z.enum([ActionItem.DECREASE, ActionItem.INCREASE]),
    items: z
      .array(
        z.object({
          productId: z.number().int().positive(),
          quantity: z.number().int().positive().min(0),
        }),
      )
      .min(1),
  })
  .strict();
export type UpdateGuestOrderBodyType = z.infer<typeof UpdateGuestOrderBodySchema>;
export type CreateGuestOrderBodyType = z.infer<typeof CreateGuestOrderBodySchema>;
export type UpdateUserOrderBodyType = z.infer<typeof UpdateUserOrderBodySchema>;
export type CreateUserOrderBodyType = z.infer<typeof CreateUserOrderBodySchema>;
export type ChooseItemOrderBodyType = z.infer<typeof ChooseItemOrderBodySchema>;
export type ActionItemType = (typeof ActionItem)[keyof typeof ActionItem];
