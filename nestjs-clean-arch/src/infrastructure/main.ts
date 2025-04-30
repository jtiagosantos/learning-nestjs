import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './modules/app.module';
import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { BadRequestInterceptor } from './interceptors/bad-request.interceptor';
import { ConflictInterceptor } from './interceptors/conflict.interceptor';
import { EntityNotFoundInterceptor } from './interceptors/entity-not-found.interceptor';
import { InvalidCredentialsInterceptor } from './interceptors/invalid-credentials.interceptor';
import { ValidationInterceptor } from './interceptors/validation.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: new ConsoleLogger({
        prefix: 'NestJs-Clean-Architecture',
      }),
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new BadRequestInterceptor());
  app.useGlobalInterceptors(new ConflictInterceptor());
  app.useGlobalInterceptors(new EntityNotFoundInterceptor());
  app.useGlobalInterceptors(new InvalidCredentialsInterceptor());
  app.useGlobalInterceptors(new ValidationInterceptor());
  await app.listen(3000, '0.0.0.0');
}

void bootstrap();
