import { UserModule } from 'src/routes/users/user.module';
import { ProfileController } from './profile.controllers';
import { ProfileService } from './profile.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
