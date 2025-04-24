import { RegisterUserUseCase } from '@/application/use-cases/register-user.use-case';
import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from '../database/in-memory/repositories/in-memory-user.repository';
import { BcryptjsHashProvider } from '../providers/hash/bcryptjs.provider';
import { HashProvider } from '@/@core/providers/hash.provider';
import { UserRepository } from '@/domain/repositories/user.repository';
import { SignInUserUseCase } from '@/application/use-cases/signin-user.use-case';
import { GetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '@/application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/update-user.use-case';
import { UpdateUserPasswordUseCase } from '@/application/use-cases/update-user-password.use-case';
import { DeleteUserUseCase } from '@/application/use-cases/delete-user.use-case';
import { UsersController } from '../http/controllers/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: InMemoryUserRepository, // change to your actual repository implementation
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProvider,
      ) => {
        return new RegisterUserUseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SignInUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProvider,
      ) => {
        return new SignInUserUseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new GetUserUseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new ListUsersUseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new UpdateUserUseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserPasswordUseCase,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProvider,
      ) => {
        return new UpdateUserPasswordUseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new DeleteUserUseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UserModule {}
