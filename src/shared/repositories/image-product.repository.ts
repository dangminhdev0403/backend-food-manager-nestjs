import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ImageProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createImage(urlImage: string) {
    return this.prismaService.imageProduct.create({
      data: {
        url: urlImage,
      },
    });
  }
}
