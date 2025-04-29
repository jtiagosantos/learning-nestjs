import { TestingSetup } from '@/infrastructure/database/typeorm/config/testing.setup';
import { TypeORMUserRepository } from '@/infrastructure/database/typeorm/repositories/typeorm-user.repository';
import { User } from '@/infrastructure/database/typeorm/entities/user.entity';
import { GetUserUseCase } from './get-user.use-case';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { randomUUID } from 'node:crypto';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { UserMapper } from '../mappers/user.mapper';

describe('GetUserUseCase (integration)', () => {
  let sut: GetUserUseCase;
  let userRepository: TypeORMUserRepository;

  beforeAll(async () => {
    await TestingSetup.start();
  });

  beforeEach(async () => {
    await TestingSetup.sync();

    userRepository = new TypeORMUserRepository(
      TestingSetup.dataSource.getRepository(User),
    );
    sut = new GetUserUseCase(userRepository);
  });

  afterEach(async () => {
    await TestingSetup.drop();
  });

  afterAll(async () => {
    await TestingSetup.destroy();
  });

  it('should be able to get a user by id', async () => {
    const entity = new UserEntity(UserPropsMaker.make());
    await userRepository.insert(entity);

    const user = await sut.execute({ id: entity.id });

    expect(user).toStrictEqual({
      ...UserMapper.toOutput(entity),
      createdAt: expect.any(Date),
    });
  });

  it('should not be able to get an inexistent user', async () => {
    const id = randomUUID();
    await expect(() => sut.execute({ id })).rejects.toThrow(
      new BadRequestError(`user with id ${id} not found`),
    );
  });
});
