import { InMemoryUserRepository } from '@/infrastructure/database/repositories/in-memory/in-memory-user.repository';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { DeleteUserUseCase } from './delete-user.use-case';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { faker } from '@faker-js/faker/.';

describe('DeleteUserUseCase (unit)', () => {
  let sut: DeleteUserUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new DeleteUserUseCase(userRepository);
  });

  it('should not be able to delete a user without id', async () => {
    await expect(() =>
      sut.execute({ id: undefined as unknown as string }),
    ).rejects.toThrow(new BadRequestError('input data not provided: id'));
  });

  it('should not be able to delete an inexistent user', async () => {
    await expect(() => sut.execute({ id: 'non-existent-id' })).rejects.toThrow(
      new BadRequestError('user with id non-existent-id not found'),
    );
  });

  it('should be able to delete a user', async () => {
    const email = faker.internet.email();
    await userRepository.insert(new UserEntity(UserPropsMaker.make({ email })));

    const user = (await userRepository.findByEmail(email))!;

    expect(userRepository.data).toHaveLength(1);

    await sut.execute({ id: user.id });

    const userExists = userRepository.data.some(user => user.id === user.id);

    expect(userExists).toBe(false);
    expect(userRepository.data).toHaveLength(0);
  });
});
