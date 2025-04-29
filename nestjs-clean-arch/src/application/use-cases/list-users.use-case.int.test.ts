import { TestingSetup } from '@/infrastructure/database/typeorm/config/testing.setup';
import { TypeORMUserRepository } from '@/infrastructure/database/typeorm/repositories/typeorm-user.repository';
import { User } from '@/infrastructure/database/typeorm/entities/user.entity';
import { ListUsersUseCase } from './list-users.use-case';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { UserMapper } from '../mappers/user.mapper';

describe('ListUsersUseCase (integration)', () => {
  let sut: ListUsersUseCase;
  let userRepository: TypeORMUserRepository;

  beforeAll(async () => {
    await TestingSetup.start();
  });

  beforeEach(async () => {
    await TestingSetup.sync();

    userRepository = new TypeORMUserRepository(
      TestingSetup.dataSource.getRepository(User),
    );
    sut = new ListUsersUseCase(userRepository);
  });

  afterEach(async () => {
    await TestingSetup.drop();
  });

  afterAll(async () => {
    await TestingSetup.destroy();
  });

  it('should be able to return the users ordered by createdAt', async () => {
    const createdAt = new Date();

    await userRepository.insert(
      new UserEntity(UserPropsMaker.make({ createdAt })),
    );
    await userRepository.insert(
      new UserEntity(
        UserPropsMaker.make({ createdAt: new Date(createdAt.getTime() + 1) }),
      ),
    );

    const data = await userRepository.findAll();

    const output = await sut.execute({});

    expect(output).toStrictEqual({
      data: data.reverse().map(entity => ({
        ...UserMapper.toOutput(entity),
        createdAt: expect.any(Date),
      })),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    });
  });

  it('should be able to return the users using pagination, sort and filter', async () => {
    await userRepository.insert(
      new UserEntity(UserPropsMaker.make({ name: 'a' })),
    );
    await userRepository.insert(
      new UserEntity(UserPropsMaker.make({ name: 'AA' })),
    );
    await userRepository.insert(
      new UserEntity(UserPropsMaker.make({ name: 'Aa' })),
    );
    await userRepository.insert(
      new UserEntity(UserPropsMaker.make({ name: 'b' })),
    );
    await userRepository.insert(
      new UserEntity(UserPropsMaker.make({ name: 'c' })),
    );

    const data = await userRepository.findAll();

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      data: [
        { ...data[1].toJSON(), createdAt: expect.any(Date) },
        { ...data[2].toJSON(), createdAt: expect.any(Date) },
      ],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    });

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      data: [{ ...data[0].toJSON(), createdAt: expect.any(Date) }],
      total: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    });

    output = await sut.execute({
      page: 1,
      perPage: 3,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      data: [
        { ...data[0].toJSON(), createdAt: expect.any(Date) },
        { ...data[2].toJSON(), createdAt: expect.any(Date) },
        { ...data[1].toJSON(), createdAt: expect.any(Date) },
      ],
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    });
  });
});
