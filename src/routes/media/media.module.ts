import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from 'src/routes/media/media.controllers';

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
