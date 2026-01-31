import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}
  getHello(): string {
    console.log(
      this.i18n.t('error.NOT_FOUND', {
        lang: I18nContext.current()?.lang,
      }),
    );

    return 'Hello World!';
  }
}
