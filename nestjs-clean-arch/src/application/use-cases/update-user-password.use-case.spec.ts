import { InMemoryUserRepository } from '@/infrastructure/database/repositories/in-memory/in-memory-user.repository';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { faker } from '@faker-js/faker/.';
import { UpdateUserPasswordUseCase } from './update-user-password.use-case';
import { HashProvider } from '@/@core/providers/hash.provider';
import { HashProviderFaker } from '@/@core/fakers/hash.provider.faker';
import { randomUUID } from 'node:crypto';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { InvalidCredentialsError } from '@/@core/errors/invalid-credentials.error';

describe('UpdateUserPasswordUseCase (unit)', () => {
  let sut: UpdateUserPasswordUseCase;
  let userRepository: InMemoryUserRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hashProvider = new HashProviderFaker();
    sut = new UpdateUserPasswordUseCase(userRepository, hashProvider);
  });

  it('should not be able to update the user password without id', async () => {
    await expect(() =>
      sut.execute({
        id: undefined as unknown as string,
        oldPassword: faker.internet.password(),
        newPassword: faker.internet.password(),
      }),
    ).rejects.toThrow(new BadRequestError('input data not provided: id'));
  });

  it('should not be able to update user password without oldPassword', async () => {
    await expect(() =>
      sut.execute({
        id: randomUUID(),
        oldPassword: '',
        newPassword: faker.internet.password(),
      }),
    ).rejects.toThrow(
      new BadRequestError('input data not provided: oldPassword'),
    );
  });

  it('should not be able to update the user password without newPassword', async () => {
    await expect(() =>
      sut.execute({
        id: randomUUID(),
        oldPassword: faker.internet.password(),
        newPassword: '',
      }),
    ).rejects.toThrow(
      new BadRequestError('input data not provided: newPassword'),
    );
  });

  it('should not be able to update the user password for an inexistent user', async () => {
    const id = randomUUID();
    await expect(() =>
      sut.execute({
        id,
        oldPassword: faker.internet.password(),
        newPassword: faker.internet.password(),
      }),
    ).rejects.toThrow(new EntityNotFoundError(`user with id ${id} not found`));
  });

  it('should not be able to update the user password with an invalid old password', async () => {
    const id = randomUUID();

    await userRepository.insert(new UserEntity(UserPropsMaker.make(), id));

    await expect(() =>
      sut.execute({
        id,
        oldPassword: faker.internet.password(),
        newPassword: faker.internet.password(),
      }),
    ).rejects.toThrow(
      new InvalidCredentialsError('old password does not match'),
    );
  });

  it('should be able to update the user password', async () => {
    const id = randomUUID();
    const password = faker.internet.password();
    const encryptedPassword = await hashProvider.generateHash(password);

    await userRepository.insert(
      new UserEntity(UserPropsMaker.make({ password: encryptedPassword }), id),
    );

    const updatedUser = await sut.execute({
      id,
      oldPassword: password,
      newPassword: faker.internet.password(),
    });

    const user = (await userRepository.findById(id))!;

    expect(updatedUser).toBeDefined();
    expect(user.password).toBe(updatedUser.password);
  });
});
