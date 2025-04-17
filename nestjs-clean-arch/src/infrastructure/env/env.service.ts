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
}
