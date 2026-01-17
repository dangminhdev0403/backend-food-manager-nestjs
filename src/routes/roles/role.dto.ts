import { createZodDto } from "nestjs-zod";
import { RoleCreateSchema } from "src/routes/roles/role.model";

export class RoleCreateBodyDTO extends createZodDto(RoleCreateSchema) {}