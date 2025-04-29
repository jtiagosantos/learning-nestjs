import { Module } from '@nestjs/common';
import { databaseProviders } from './typeorm/config/database.provider';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
