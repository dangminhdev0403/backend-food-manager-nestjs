import { Module } from '@nestjs/common';
import { UserRepository } from 'src/routes/users/user.repository';
import { UserController } from './user.controllers';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
