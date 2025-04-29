import { EnvService } from '@/infrastructure/env/env.service';
import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

export const databaseProviders: Provider[] = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (envService: EnvService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: envService.getDatabaseHost(),
        port: envService.getDatabasePort(),
        username: envService.getDatabaseUsername(),
        password: envService.getDatabasePassword(),
        database: envService.getDatabaseName(),
        entities: [User],
        synchronize: false,
      });

      return dataSource.initialize();
    },
    inject: [EnvService],
  },
];
