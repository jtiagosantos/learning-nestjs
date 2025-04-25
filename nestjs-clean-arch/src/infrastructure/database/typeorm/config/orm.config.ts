import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUsersTable1745542642787 } from '../migrations/1745542642787-CreateUsersTable';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User],
  synchronize: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [CreateUsersTable1745542642787],
});
