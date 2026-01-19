import { createZodDto } from "nestjs-zod";
import { ChangePassBodySchema } from "src/routes/profile/profile.model";


export class ChangePassBodyDTO extends createZodDto(ChangePassBodySchema) {}
