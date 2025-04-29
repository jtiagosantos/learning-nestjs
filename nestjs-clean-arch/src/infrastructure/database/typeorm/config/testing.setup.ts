import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';

export class TestingSetup {
  static dataSource: DataSource;

  static async start() {
    const dataSourceOptions: DataSourceOptions = {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User],
      schema: 'test',
      synchronize: true,
    };

    this.dataSource = new DataSource(dataSourceOptions);

    await this.dataSource.initialize();

    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "test"`);
  }

  static async sync() {
    await this.dataSource.synchronize(true);
  }

  static async drop() {
    await this.dataSource.dropDatabase();
  }

  static async destroy() {
    await this.dataSource.destroy();
  }
}
