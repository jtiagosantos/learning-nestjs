import { InMemoryUserRepository } from '@/infrastructure/database/in-memory/repositories/in-memory-user.repository';
import { RegisterUserUseCase } from './register-user.use-case';
import { HashProvider } from '@/@core/providers/hash.provider';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { ConflictError } from '@/@core/errors/conflict.error';
import { HashProviderFaker } from '@/@core/fakers/hash.provider.faker';
import { EntityValidationError } from '@/@core/errors/entity-validation.error';
import { Email } from '@/domain/value-objects/email.value-object';

describe('RegisterUserUseCase (unit)', () => {
  let sut: RegisterUserUseCase;
  let userRepository: InMemoryUserRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hashProvider = new HashProviderFaker();
    sut = new RegisterUserUseCase(userRepository, hashProvider);
  });

  it('should be able to register a user', async () => {
    const input = UserPropsMaker.make();

    const result = await sut.execute(input);

    expect(result).toStrictEqual({
      id: expect.any(String),
      name: input.name,
      email: input.email,
      password: expect.any(String),
      createdAt: expect.any(Date),
    });
    expect(userRepository.data).toHaveLength(1);
  });

  it('should not be able to register a user with an existing email', async () => {
    const input = UserPropsMaker.make();

    await sut.execute(input);

    await expect(() => sut.execute(input)).rejects.toThrow(
      new ConflictError(`email ${input.email} already exists`),
    );
  });

  it('should not be able to register a user without name', async () => {
    const input = UserPropsMaker.make();
    input.name = undefined as unknown as string;

    await expect(() => sut.execute(input)).rejects.toThrow(
      new ConflictError('input data not provided: name'),
    );
  });

  it('should not be able to register a user without email', async () => {
    const input = UserPropsMaker.make();
    input.email = undefined as unknown as string;

    await expect(() => sut.execute(input)).rejects.toThrow(
      new ConflictError('input data not provided: email'),
    );
  });
  it('should not be able to register a user without password', async () => {
    const input = UserPropsMaker.make();
    input.password = undefined as unknown as string;

    await expect(() => sut.execute(input)).rejects.toThrow(
      new ConflictError('input data not provided: password'),
    );
  });

  it('should not be able to register a user with an invalid email', async () => {
    const input = UserPropsMaker.make();
    input.email = 'invalid-email';

    await expect(() => sut.execute(input)).rejects.toThrow(
      new EntityValidationError(Email.name, 'invalid email format'),
    );
  });
});
