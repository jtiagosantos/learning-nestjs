import { UserRepository } from '@/domain/repositories/user.repository';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { UserOutput } from '../outputs/user.output';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { UseCase } from '@/@core/base/use-case';
import { UpdateUserInput } from '../inputs/update-user.input';
import { UserMapper } from '../mappers/user.mapper';

export class UpdateUserUseCase implements UseCase<UpdateUserInput, UserOutput> {
  constructor(private userRepository: UserRepository) {}

  async execute(input: UpdateUserInput) {
    const { id, name } = input;

    if (!id) {
      throw new BadRequestError('input data not provided: id');
    }

    if (!name) {
      throw new BadRequestError('input data not provided: name');
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundError(`user with id ${id} not found`);
    }

    user.updateName(name);

    await this.userRepository.update(user);

    return UserMapper.toOutput(user);
  }
}
