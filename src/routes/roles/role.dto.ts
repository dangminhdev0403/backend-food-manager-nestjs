import { createZodDto } from 'nestjs-zod';
import { RoleCreateSchema, RoleUpdateSchema } from 'src/routes/roles/role.model';

export class RoleCreateBodyDTO extends createZodDto(RoleCreateSchema) {}
export class RoleUpdateBodyDTO extends createZodDto(RoleUpdateSchema) {}
