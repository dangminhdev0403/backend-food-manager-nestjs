import { createZodDto } from 'nestjs-zod';
import { LanguageCreateSchema, LanguageDeleteSchema, LanguageUpdateSchema } from 'src/routes/languages/language.model';

export class LanguageCreateBodyDTO extends createZodDto(LanguageCreateSchema) {}
export class LanguageUpdateBodyDTO extends createZodDto(LanguageUpdateSchema) {}
export class LanguageDeleteBodyDTO extends createZodDto(LanguageDeleteSchema) {}
