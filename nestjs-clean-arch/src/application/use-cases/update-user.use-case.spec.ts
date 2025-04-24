import { InMemoryUserRepository } from '@/infrastructure/database/in-memory/repositories/in-memory-user.repository';
import { UpdateUserUseCase } from './update-user.use-case';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { randomUUID } from 'node:crypto';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { faker } from '@faker-js/faker/.';
import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { UserMapper } from '../mappers/user.mapper';

describe('UpdateUserUseCase (unit)', () => {
  let sut: UpdateUserUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new UpdateUserUseCase(userRepository);
  });

  it('should not be able to update a user without id', async () => {
    await expect(() =>
      sut.execute({ id: undefined as unknown as string, name: 'John Doe' }),
    ).rejects.toThrow(new BadRequestError('input data not provided: id'));
  });

  it('should not be able to update a user without name', async () => {
    await expect(() =>
      sut.execute({ id: randomUUID(), name: '' }),
    ).rejects.toThrow(new BadRequestError('input data not provided: name'));
  });

  it('should not be able to update an inexistent user', async () => {
    const id = randomUUID();
    await expect(() => sut.execute({ id, name: 'John Doe' })).rejects.toThrow(
      new EntityNotFoundError(`user with id ${id} not found`),
    );
  });

  it('should be able to update a user', async () => {
    const email = faker.internet.email();

    await userRepository.insert(new UserEntity(UserPropsMaker.make({ email })));

    const user = (await userRepository.findByEmail(email))!;

    const newName = faker.person.fullName();

    const updatedUser = await sut.execute({
      id: user.id,
      name: newName,
    });

    expect(updatedUser).toStrictEqual({
      ...UserMapper.toOutput(user),
      name: newName,
    });
  });
});
