import { UserRepository } from '@/domain/repositories/user.repository';
import { BadRequestError } from '@/@core/errors/bad-request.error';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { UseCase } from '@/@core/base/use-case';
import { DeleteUserInput } from '../inputs/delete-user.input';

export class DeleteUserUseCase implements UseCase<DeleteUserInput, void> {
  constructor(private userRepository: UserRepository) {}

  async execute(input: DeleteUserInput) {
    const { id } = input;

    if (!id) {
      throw new BadRequestError('input data not provided: id');
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundError(`user with id ${id} not found`);
    }

    await this.userRepository.delete(id);
  }
}
