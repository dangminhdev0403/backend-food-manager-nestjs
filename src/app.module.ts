import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE, Reflector } from '@nestjs/core';
import { JwtGlobalModule } from 'src/routes/auth/passport/jwt.module';
import { CatchEverythingFilter } from 'src/shared/filters/catch-everything.filter';
import { HttpExceptionFilter } from 'src/shared/filters/custom-zod-filter.pipe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './routes/auth/auth.controller';
import { AuthModule } from './routes/auth/auth.module';
import { MyZodValidationPipe } from 'src/shared/pipe/custom-zod-validation.pipe';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), JwtGlobalModule, AuthModule],
  controllers: [AuthController, AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: (reflector: Reflector) => {
        return new (class extends MyZodValidationPipe {
          transform(value, metadata) {
            metadata.context = (global as any).currentContext;
            return super.transform(value, metadata);
          }
        })(reflector);
      },
      inject: [Reflector],
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
