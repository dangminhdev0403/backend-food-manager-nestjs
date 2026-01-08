import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CatchEverythingFilter } from 'src/shared/filters/catch-everything.filter';
import { HttpExceptionFilter } from 'src/shared/filters/custom-zod-filter.pipe';
import MyZodValidationPipe from 'src/shared/pipe/custom-zod-validation.pipe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './routes/auth/auth.controller';
import { AuthModule } from './routes/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtGlobalModule } from 'src/routes/auth/passport/jwt.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), JwtGlobalModule],
  controllers: [AuthController, AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: MyZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
