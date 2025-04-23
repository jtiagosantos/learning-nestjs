import { UserRepository } from '@/domain/repositories/user.repository';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { UserOutput } from '../outputs/user.output';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { UseCase } from '@/@core/base/use-case';
import { UserMapper } from '../mappers/user.mapper';
import { UpdateUserPasswordInput } from '../inputs/update-user-password.input';
import { HashProvider } from '@/@core/providers/hash.provider';
import { InvalidCredentialsError } from '@/@core/errors/invalid-credentials.error';

export class UpdateUserPasswordUseCase
  implements UseCase<UpdateUserPasswordInput, UserOutput>
{
  constructor(
    private userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: UpdateUserPasswordInput) {
    const { id, oldPassword, newPassword } = input;

    if (!id) {
      throw new BadRequestError('input data not provided: id');
    }

    if (!oldPassword) {
      throw new BadRequestError('input data not provided: oldPassword');
    }

    if (!newPassword) {
      throw new BadRequestError('input data not provided: newPassword');
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundError(`user with id ${id} not found`);
    }

    const isOldPasswordMatched = await this.hashProvider.compareHash(
      oldPassword,
      user.password,
    );

    if (!isOldPasswordMatched) {
      throw new InvalidCredentialsError('old password does not match');
    }

    const encryptedNewPassword =
      await this.hashProvider.generateHash(newPassword);

    user.updatePassword(encryptedNewPassword);

    await this.userRepository.update(user);

    return UserMapper.toOutput(user);
  }
}
