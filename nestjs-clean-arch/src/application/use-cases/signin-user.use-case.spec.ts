import { InMemoryUserRepository } from '@/infrastructure/database/in-memory/repositories/in-memory-user.repository';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { SignInUserUseCase } from './signin-user.use-case';
import { HashProvider } from '@/@core/providers/hash.provider';
import { HashProviderFaker } from '@/@core/fakers/hash.provider.faker';
import { faker } from '@faker-js/faker/.';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { InvalidCredentialsError } from '@/@core/errors/invalid-credentials.error';

describe('SignInUserUseCase (unit)', () => {
  let sut: SignInUserUseCase;
  let userRepository: InMemoryUserRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hashProvider = new HashProviderFaker();
    sut = new SignInUserUseCase(userRepository, hashProvider);
  });

  it('should not be able to signin a user without email', async () => {
    await expect(() =>
      sut.execute({ email: '', password: faker.internet.password() }),
    ).rejects.toThrow(new BadRequestError('input data not provided: email'));
  });

  it('should not be able to signin a user without password', async () => {
    await expect(() =>
      sut.execute({ email: faker.internet.email(), password: '' }),
    ).rejects.toThrow(new BadRequestError('input data not provided: password'));
  });

  it('should not be able to signin a user with an inexistent email', async () => {
    const email = faker.internet.email();

    await expect(() =>
      sut.execute({
        email,
        password: faker.internet.password(),
      }),
    ).rejects.toThrow(
      new EntityNotFoundError(`user with email ${email} not found`),
    );
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
    ).rejects.toThrow(new InvalidCredentialsError('password does not match'));
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
});
