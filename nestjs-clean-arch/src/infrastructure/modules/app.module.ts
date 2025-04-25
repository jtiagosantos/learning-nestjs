import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { UserModule } from './user.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    EnvModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
