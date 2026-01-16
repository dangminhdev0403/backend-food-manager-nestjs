import { RoleModule } from './routes/roles/role.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE, DiscoveryModule, Reflector } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtGlobalModule } from 'src/routes/auth/passport/jwt.module';
import { CatchEverythingFilter } from 'src/shared/filters/catch-everything.filter';
import { HttpExceptionFilter } from 'src/shared/filters/custom-zod-filter.pipe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './routes/auth/auth.controller';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [RoleModule, ConfigModule.forRoot({ isGlobal: true }), JwtGlobalModule, AuthModule, DiscoveryModule],
  controllers: [AuthController, AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: (reflector: Reflector) => {
        return new (class extends ZodValidationPipe {
          transform(value, metadata) {
            metadata.context = (globalThis as any).currentContext;
            return super.transform(value, metadata);
          }
        })();
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
