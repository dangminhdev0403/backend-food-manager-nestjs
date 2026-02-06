import { createZodDto } from 'nestjs-zod';
import {
  AddItemOrderBodySchema,
  CreateGuestOrderBodySchema,
  CreateUserOrderBodySchema,
  UpdateGuestOrderBodySchema,
  UpdateItemOrderBodySchema,
  UpdateUserOrderBodySchema,
} from 'src/routes/orders/order.model';

export class OrderGuestCreateBodyDto extends createZodDto(CreateGuestOrderBodySchema) {}
export class OrderGuestUpdateBodyDto extends createZodDto(UpdateGuestOrderBodySchema) {}
export class OrderUsertCreateBodyDto extends createZodDto(CreateUserOrderBodySchema) {}
export class OrderUsertUpdateBodyDto extends createZodDto(UpdateUserOrderBodySchema) {}
export class AddItemsOrderBodyDto extends createZodDto(AddItemOrderBodySchema) {}
export class UpdateItemsOrderBodyDto extends createZodDto(UpdateItemOrderBodySchema) {}
