import { BadRequestError } from '@/@core/errors/bad-request.error';
import { UserRepository } from '@/domain/repositories/user.repository';
import { HashProvider } from '@/@core/providers/hash.provider';
import { UserOutput } from '../outputs/user.output';
import { UseCase } from '@/@core/base/use-case';
import { UserMapper } from '../mappers/user.mapper';
import { SignInUserInput } from '../inputs/signin-user.input';
import { EntityNotFoundError } from '@/@core/errors/entity-not-found.error';
import { InvalidCredentialsError } from '@/@core/errors/invalid-credentials.error';

export class SignInUserUseCase implements UseCase<SignInUserInput, UserOutput> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: SignInUserInput) {
    const { email, password } = input;

    if (!email) {
      throw new BadRequestError('input data not provided: email');
    }

    if (!password) {
      throw new BadRequestError('input data not provided: password');
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new EntityNotFoundError(`user with email ${email} not found`);
    }

    const isPasswordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new InvalidCredentialsError('password does not match');
    }

    return UserMapper.toOutput(user);
  }
}
