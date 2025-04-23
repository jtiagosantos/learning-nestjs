import { UserRepository } from '@/domain/repositories/user.repository';
import { GetUserInput } from '../inputs/get-user.input';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { UserOutput } from '../outputs/user.output';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { UseCase } from '@/@core/base/use-case';
import { UserMapper } from '../mappers/user.mapper';

export class GetUserUseCase implements UseCase<GetUserInput, UserOutput> {
  constructor(private userRepository: UserRepository) {}

  async execute(input: GetUserInput) {
    const { id } = input;

    if (!id) {
      throw new BadRequestError('input data not provided: id');
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundError(`user with id ${id} not found`);
    }

    return UserMapper.toOutput(user);
  }
}
