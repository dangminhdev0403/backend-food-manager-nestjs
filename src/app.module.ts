import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
