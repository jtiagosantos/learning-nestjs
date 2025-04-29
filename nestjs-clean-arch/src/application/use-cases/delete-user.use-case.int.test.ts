import { TestingSetup } from '@/infrastructure/database/typeorm/config/testing.setup';
import { TypeORMUserRepository } from '@/infrastructure/database/typeorm/repositories/typeorm-user.repository';
import { User } from '@/infrastructure/database/typeorm/entities/user.entity';
import { DeleteUserUseCase } from './delete-user.use-case';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker/.';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';

describe('DeleteUserUseCase (integration)', () => {
  let sut: DeleteUserUseCase;
  let userRepository: TypeORMUserRepository;

  beforeAll(async () => {
    await TestingSetup.start();
  });

  beforeEach(async () => {
    await TestingSetup.sync();

    userRepository = new TypeORMUserRepository(
      TestingSetup.dataSource.getRepository(User),
    );
    sut = new DeleteUserUseCase(userRepository);
  });

  afterEach(async () => {
    await TestingSetup.drop();
  });

  afterAll(async () => {
    await TestingSetup.destroy();
  });

  it('should be able to delete a user', async () => {
    const entity = new UserEntity(
      UserPropsMaker.make({ email: faker.internet.email() }),
    );
    await userRepository.insert(entity);

    let users = await userRepository.findAll();

    expect(users).toHaveLength(1);

    await sut.execute({ id: entity.id });

    users = await userRepository.findAll();

    const userExists = users.some(user => user.id === entity.id);

    expect(userExists).toBeFalsy();
    expect(users).toHaveLength(0);
  });

  it('should not be able to delete an inexistent user', async () => {
    const id = randomUUID();
    await expect(() => sut.execute({ id })).rejects.toThrow(
      new BadRequestError(`user with id ${id} not found`),
    );
  });
});
