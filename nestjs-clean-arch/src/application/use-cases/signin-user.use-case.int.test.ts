import { TestingSetup } from '@/infrastructure/database/typeorm/config/testing.setup';
import { TypeORMUserRepository } from '@/infrastructure/database/typeorm/repositories/typeorm-user.repository';
import { User } from '@/infrastructure/database/typeorm/entities/user.entity';
import { BcryptjsHashProvider } from '@/infrastructure/providers/hash/bcryptjs.provider';
import { HashProvider } from '@/@core/providers/hash.provider';
import { faker } from '@faker-js/faker/.';
import { SignInUserUseCase } from './signin-user.use-case';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { InvalidCredentialsError } from '@/@core/errors/invalid-credentials.error';

describe('SignInUserUseCase (integration)', () => {
  let sut: SignInUserUseCase;
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
    sut = new SignInUserUseCase(userRepository, hashProvider);
  });

  afterEach(async () => {
    await TestingSetup.drop();
  });

  afterAll(async () => {
    await TestingSetup.destroy();
  });

  it('should be able to signin a user with valid credentials', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const encryptedPassword = await hashProvider.generateHash(password);

    await userRepository.insert(
      new UserEntity(
        UserPropsMaker.make({ email, password: encryptedPassword }),
      ),
    );

    const user = await sut.execute({
      email,
      password,
    });

    expect(user).toMatchObject({
      email,
      password: encryptedPassword,
    });
  });

  it('should not be able to signin a user with an inexistent email', async () => {
    const email = faker.internet.email();

    await expect(() =>
      sut.execute({
        email,
        password: faker.internet.password(),
      }),
    ).rejects.toThrow(new InvalidCredentialsError('invalid credentials'));
  });

  it('should not be able to signin a user with an invalid password', async () => {
    const email = faker.internet.email();
    const encryptedPassword = await hashProvider.generateHash(
      faker.internet.password(),
    );

    await userRepository.insert(
      new UserEntity(
        UserPropsMaker.make({ email, password: encryptedPassword }),
      ),
    );

    await expect(() =>
      sut.execute({
        email,
        password: 'invalid-password',
      }),
    ).rejects.toThrow(new InvalidCredentialsError('invalid credentials'));
  });
});
