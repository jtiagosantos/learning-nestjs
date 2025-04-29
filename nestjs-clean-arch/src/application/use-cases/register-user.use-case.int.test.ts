import { TestingSetup } from '@/infrastructure/database/typeorm/config/testing.setup';
import { RegisterUserUseCase } from './register-user.use-case';
import { TypeORMUserRepository } from '@/infrastructure/database/typeorm/repositories/typeorm-user.repository';
import { User } from '@/infrastructure/database/typeorm/entities/user.entity';
import { BcryptjsHashProvider } from '@/infrastructure/providers/hash/bcryptjs.provider';
import { HashProvider } from '@/@core/providers/hash.provider';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { ConflictError } from '@/@core/errors/conflict.error';
import { UserEntity } from '@/domain/entities/user.entity';

describe('RegisterUserUseCase (integration)', () => {
  let sut: RegisterUserUseCase;
  let userRepository: TypeORMUserRepository;
  let hashProvider: HashProvider;

  beforeAll(async () => {
    await TestingSetup.start();
  });

  beforeEach(async () => {
    await TestingSetup.sync();

    userRepository = new TypeORMUserRepository(
      TestingSetup.dataSource.getRepository(User),
    );
    hashProvider = new BcryptjsHashProvider();
    sut = new RegisterUserUseCase(userRepository, hashProvider);
  });

  afterEach(async () => {
    await TestingSetup.drop();
  });

  afterAll(async () => {
    await TestingSetup.destroy();
  });

  it('should be able to register a user', async () => {
    const input = UserPropsMaker.make();

    const result = await sut.execute(input);

    expect(result).toStrictEqual({
      id: expect.any(String),
      name: input.name,
      email: input.email,
      password: expect.any(String),
      createdAt: expect.any(Date),
    });
    await expect(userRepository.findAll()).resolves.toHaveLength(1);
  });

  it('should not be able to register a user with an existing email', async () => {
    const input = UserPropsMaker.make();

    await userRepository.insert(new UserEntity(input));

    await expect(() => sut.execute(input)).rejects.toThrow(
      new ConflictError(`email ${input.email} already exists`),
    );
  });
});
