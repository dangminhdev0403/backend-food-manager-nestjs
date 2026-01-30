import { Module } from '@nestjs/common';
import { AdminLanguagesController } from 'src/routes/languages/controllers/admin-language.controller';
import { UserLanguagesController } from 'src/routes/languages/controllers/user-language.controller';
import { LanguageRepository } from 'src/routes/languages/language.repository';
import { PermissionModule } from 'src/routes/permissions/permission.module';
import { LanguageService } from './language.service';

@Module({
  imports: [PermissionModule],
  controllers: [UserLanguagesController, AdminLanguagesController],
  providers: [LanguageService, LanguageRepository],
})
export class LanguagesModule {}
