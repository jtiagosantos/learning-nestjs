import { InMemoryUserRepository } from '@/infrastructure/database/in-memory/repositories/in-memory-user.repository';
import { ListUsersUseCase } from './list-users.use-case';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { UserMapper } from '../mappers/user.mapper';

describe('ListUsersUseCase (unit)', () => {
  let sut: ListUsersUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new ListUsersUseCase(userRepository);
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
      data: [...data].reverse().map(entity => UserMapper.toOutput(entity)),
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
      data: [data[1].toJSON(), data[2].toJSON()],
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
      data: [data[0].toJSON()],
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
      data: [data[0].toJSON(), data[2].toJSON(), data[1].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    });
  });
});
