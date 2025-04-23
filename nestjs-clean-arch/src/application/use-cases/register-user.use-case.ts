import { BadRequestError } from '@/@core/errors/bad-request.error';
import { RegisterUserInput } from '../inputs/register-user.input';
import { UserRepository } from '@/domain/repositories/user.repository';
import { UserEntity } from '@/domain/entities/user.entity';
import { HashProvider } from '@/@core/providers/hash.provider';
import { ConflictError } from '@/@core/errors/conflict.error';
import { UserOutput } from '../outputs/user.output';
import { UseCase } from '@/@core/base/use-case';
import { UserMapper } from '../mappers/user.mapper';

export class RegisterUserUseCase
  implements UseCase<RegisterUserInput, UserOutput>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: RegisterUserInput) {
    const { name, email, password } = input;

    if (!name) {
      throw new BadRequestError('input data not provided: name');
    }

    if (!email) {
      throw new BadRequestError('input data not provided: email');
    }

    if (!password) {
      throw new BadRequestError('input data not provided: password');
    }

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new ConflictError(`email ${email} already exists`);
    }

    const encryptedPassword = await this.hashProvider.generateHash(password);

    const user = new UserEntity({
      name,
      email,
      password: encryptedPassword,
    });

    await this.userRepository.insert(user);

    return UserMapper.toOutput(user);
  }
}
