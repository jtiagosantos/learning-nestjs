import { TestingSetup } from '@/infrastructure/database/typeorm/config/testing.setup';
import { TypeORMUserRepository } from '@/infrastructure/database/typeorm/repositories/typeorm-user.repository';
import { User } from '@/infrastructure/database/typeorm/entities/user.entity';
import { UpdateUserUseCase } from './update-user.use-case';
import { randomUUID } from 'node:crypto';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { faker } from '@faker-js/faker/.';
import { UserMapper } from '../mappers/user.mapper';

describe('UpdateUserUseCase (integration)', () => {
  let sut: UpdateUserUseCase;
  let userRepository: TypeORMUserRepository;

  beforeAll(async () => {
    await TestingSetup.start();
  });

  beforeEach(async () => {
    await TestingSetup.sync();

    userRepository = new TypeORMUserRepository(
      TestingSetup.dataSource.getRepository(User),
    );
    sut = new UpdateUserUseCase(userRepository);
  });

  afterEach(async () => {
    await TestingSetup.drop();
  });

  afterAll(async () => {
    await TestingSetup.destroy();
  });

  it('should be able to update a user', async () => {
    const entity = new UserEntity(
      UserPropsMaker.make({ email: faker.internet.email() }),
    );
    await userRepository.insert(entity);

    const newName = faker.person.fullName();

    const updatedUser = await sut.execute({
      id: entity.id,
      name: newName,
    });

    expect(updatedUser).toStrictEqual({
      ...UserMapper.toOutput(entity),
      name: newName,
      createdAt: expect.any(Date),
    });
  });

  it('should not be able to update an inexistent user', async () => {
    const id = randomUUID();
    await expect(() => sut.execute({ id, name: 'John Doe' })).rejects.toThrow(
      new EntityNotFoundError(`user with id ${id} not found`),
    );
  });
});
