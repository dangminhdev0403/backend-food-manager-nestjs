import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from 'src/routes/media/media.controllers';
import { ImageProductRepository } from 'src/shared/repositories/image-product.repository';

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [MediaService, ImageProductRepository],
})
export class MediaModule {}
