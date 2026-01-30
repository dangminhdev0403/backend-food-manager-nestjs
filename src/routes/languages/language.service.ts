import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageCreateBodyDTO, LanguageDeleteBodyDTO, LanguageUpdateBodyDTO } from 'src/routes/languages/language.dto';
import { LanguageRepository } from 'src/routes/languages/language.repository';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async findAll() {
    return this.languageRepository.findAll();
  }

  async createOne(languageInput: LanguageCreateBodyDTO, userId: number) {
    return this.languageRepository.createOne({
      ...languageInput,
      User_Language_createdByIdToUser: {
        connect: {
          id: userId,
        },
      },
    });
  }

  async updateOne(languageInput: LanguageUpdateBodyDTO, userId: number) {
    return this.languageRepository.updateOne(languageInput, userId);
  }

  async findById(id: number) {
    const currentLanguage = await this.languageRepository.findById(id);
    if (!currentLanguage)
      throw new NotFoundException({
        status: 404,
        error: 'Không tìm thấy ngôn ngữ',
        message: 'Không tìm thấy ngôn ngữ',
      });
    return currentLanguage;
  }
  async delete(languageDeleteBodyDTO: LanguageDeleteBodyDTO, userId: number) {
    if (languageDeleteBodyDTO.isHard === true) {
      return this.languageRepository.hardDelete(languageDeleteBodyDTO.id);
    } else {
      return this.languageRepository.softDelete(languageDeleteBodyDTO.id, userId);
    }
  }
  async restore(languageDeleteBodyDTO: LanguageUpdateBodyDTO, userId: number) {
    return this.languageRepository.restoreDelete(languageDeleteBodyDTO.id, userId);
  }
}
