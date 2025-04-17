import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { UserModule } from './modules/user.module';

@Module({
  imports: [EnvModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
