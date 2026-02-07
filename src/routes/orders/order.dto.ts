import { createZodDto } from 'nestjs-zod';
import {
  ChooseItemOrderBodySchema,
  CreateGuestOrderBodySchema,
  CreateUserOrderBodySchema,
  UpdateGuestOrderBodySchema,
  UpdateUserOrderBodySchema,
} from 'src/routes/orders/order.model';

export class OrderGuestCreateBodyDto extends createZodDto(CreateGuestOrderBodySchema) {}
export class OrderGuestUpdateBodyDto extends createZodDto(UpdateGuestOrderBodySchema) {}
export class OrderUsertCreateBodyDto extends createZodDto(CreateUserOrderBodySchema) {}
export class OrderUsertUpdateBodyDto extends createZodDto(UpdateUserOrderBodySchema) {}
export class ChooseItemsOrderBodyDto extends createZodDto(ChooseItemOrderBodySchema) {}
