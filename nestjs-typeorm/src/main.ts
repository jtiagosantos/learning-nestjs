import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NotFoundInterceptor } from './common/interceptors/not-found.interceptor';
import { DatabaseInterceptor } from './common/interceptors/database.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new DatabaseInterceptor());
  app.useGlobalInterceptors(new NotFoundInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
