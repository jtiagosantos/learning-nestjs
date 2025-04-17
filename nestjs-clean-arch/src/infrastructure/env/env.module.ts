import { DynamicModule, Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { join } from 'node:path';

@Module({
  imports: [ConfigModule],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule extends ConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): Promise<DynamicModule> {
    return super.forRoot({
      ...options,
      envFilePath: [join(__dirname, '../../../', '.env.test')],
    });
  }
}
