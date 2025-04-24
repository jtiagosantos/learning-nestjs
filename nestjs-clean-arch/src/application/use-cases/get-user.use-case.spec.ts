import { InMemoryUserRepository } from '@/infrastructure/database/in-memory/repositories/in-memory-user.repository';
import { GetUserUseCase } from './get-user.use-case';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { UserEntity } from '@/domain/entities/user.entity';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { UserMapper } from '../mappers/user.mapper';

describe('GetUserUseCase (unit)', () => {
  let sut: GetUserUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new GetUserUseCase(userRepository);
  });

  it('should not be able to get a user without id', async () => {
    await expect(() =>
      sut.execute({ id: undefined as unknown as string }),
    ).rejects.toThrow(new BadRequestError('input data not provided: id'));
  });

  it('should not be able to get an inexistent user', async () => {
    await expect(() => sut.execute({ id: 'non-existent-id' })).rejects.toThrow(
      new BadRequestError('user with id non-existent-id not found'),
    );
  });

  it('should be able to get a user by id', async () => {
    const entity = new UserEntity(UserPropsMaker.make());
    await userRepository.insert(entity);

    const user = await sut.execute({ id: entity.id });
    expect(user).toEqual(UserMapper.toOutput(entity));
  });
});
