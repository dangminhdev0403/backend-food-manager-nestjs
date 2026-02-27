import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { TableCreateBodyDTO, TableFilterBodyDTO, TableUpdateBodyDTO } from 'src/routes/tables/table.dto';
import { TableRepository } from 'src/routes/tables/table.repository';
import { PaginationDTOQuery } from 'src/shared/constants/request.constant';

@Injectable()
export class TableService {
  constructor(
    private readonly tableRepository: TableRepository,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async getListTable(query: PaginationDTOQuery & TableFilterBodyDTO) {
    const code = I18nContext.current()?.lang as string;

    return this.tableRepository.findAll(query, code);
  }

  async createTable(table: TableCreateBodyDTO) {
    return this.tableRepository.createQrForTable(table);
  }
  async updateTable(table: TableUpdateBodyDTO) {
    return this.tableRepository.updateTable(table);
  }
  async resolveByQr(token: string) {
    const qrTable = await this.tableRepository.resolveByQr(token);
    if (!qrTable)
      throw new NotFoundException({
        status: 404,
        error: this.i18n.t('error.NOT_FOUND', {
          lang: I18nContext.current()?.lang,
          args: {
            resource: 'Token',
          },
        }),
        message: this.i18n.t('error.NOT_FOUND', {
          lang: I18nContext.current()?.lang,
          args: {
            resource: 'Token',
          },
        }),
      });
    if (qrTable.table.status !== 'EMPTY')
      throw new BadRequestException({
        status: 409,
        error: this.i18n.t('exceptionHandler.TABLE_NOT_EMPTY', {
          lang: I18nContext.current()?.lang,
        }),
        message: this.i18n.t('exceptionHandler.TABLE_NOT_EMPTY', {
          lang: I18nContext.current()?.lang,
        }),
      });
    return qrTable;
  }
  async getTableStatusCounts() {
    return this.tableRepository.getTableStatusCounts();
  }
  async deleteTable(id: number) {
    return this.tableRepository.deleteTable(id);
  }
  async customerGetListTable(query: PaginationDTOQuery) {
    const code = I18nContext.current()?.lang as string;
    return this.tableRepository.customerFindAll(query, code);
  }
  async findTableById(id: number) {
    const table = await this.tableRepository.findTableById(id);
    if (table === null)
      throw new NotFoundException({
        status: 404,
        error: this.i18n.t('exceptionHandler.NOT_FOUND', {
          lang: I18nContext.current()?.lang,
        }),
        message: this.i18n.t('exceptionHandler.NOT_FOUND', {
          lang: I18nContext.current()?.lang,
        }),
      });
    return table;
  }
}
