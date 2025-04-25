import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvService } from '../env/env.service';
import { EnvModule } from '../env/env.module';
import { User } from './typeorm/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      useFactory: async (envService: EnvService) => ({
        type: 'postgres',
        host: envService.getDatabaseHost(),
        port: envService.getDatabasePort(),
        username: envService.getDatabaseUsername(),
        password: envService.getDatabasePassword(),
        database: envService.getDatabaseName(),
        entities: [User],
        synchronize: false,
      }),
      inject: [EnvService],
    }),
  ],
})
export class DatabaseModule {}
