import { TestingSetup } from '@/infrastructure/database/typeorm/config/testing.setup';
import { TypeORMUserRepository } from '@/infrastructure/database/typeorm/repositories/typeorm-user.repository';
import { User } from '@/infrastructure/database/typeorm/entities/user.entity';
import { BcryptjsHashProvider } from '@/infrastructure/providers/hash/bcryptjs.provider';
import { HashProvider } from '@/@core/providers/hash.provider';
import { UpdateUserPasswordUseCase } from './update-user-password.use-case';
import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker/.';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { InvalidCredentialsError } from '@/@core/errors/invalid-credentials.error';

describe('UpdateUserPasswordUseCase (integration)', () => {
  let sut: UpdateUserPasswordUseCase;
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
    sut = new UpdateUserPasswordUseCase(userRepository, hashProvider);
  });

  afterEach(async () => {
    await TestingSetup.drop();
  });

  afterAll(async () => {
    await TestingSetup.destroy();
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
});
