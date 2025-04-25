import { Injectable } from '@nestjs/common';
import { Env } from './env.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService implements Env {
  constructor(private readonly configService: ConfigService) {}
  getAppPort(): number {
    return Number(this.configService.get<number>('PORT'));
  }

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV')!;
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST')!;
  }

  getDatabasePort(): number {
    return Number(this.configService.get<number>('DATABASE_PORT'));
  }

  getDatabaseUsername(): string {
    return this.configService.get<string>('DATABASE_USERNAME')!;
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD')!;
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME')!;
  }
}
