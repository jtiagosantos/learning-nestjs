import { Module } from '@nestjs/common';
import { BcryptjsHashProvider } from './hash/bcryptjs.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [BcryptjsHashProvider],
})
export class ProvidersModule {}
