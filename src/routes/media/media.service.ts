import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'nestjs-cloudinary';
import { ImageProductRepository } from 'src/shared/repositories/image-product.repository';

@Injectable()
export class MediaService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly imageRepository: ImageProductRepository,
  ) {}

  async upLoadAndSaveImageProduct(file: Express.Multer.File) {
    const uploadCloud = await this.cloudinaryService.uploadFile(file);
    return this.imageRepository.createImage(uploadCloud.url);
  }
}
