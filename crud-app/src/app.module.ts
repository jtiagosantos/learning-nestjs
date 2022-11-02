import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { CatsModule } from './modules/cat/cat.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CatController } from './modules/cat/cat.controller';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'cats', method: RequestMethod.GET })
      .forRoutes(CatController);
  }
}
