import { Test, TestingModule } from '@nestjs/testing';
import { EnvService } from './env.service';
import { EnvModule } from './env.module';

describe('EnvService (unit)', () => {
  let sut: EnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvModule.forRoot()],
      providers: [EnvService],
    }).compile();

    sut = module.get<EnvService>(EnvService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should be able to return the variable PORT', () => {
    const port = sut.getAppPort();

    expect(port).toBe(3000);
  });

  it('should be able to return the variable NODE_ENV', () => {
    const env = sut.getNodeEnv();

    expect(env).toBe('test');
  });
});
