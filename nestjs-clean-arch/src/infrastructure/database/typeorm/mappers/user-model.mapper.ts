import { UserEntity } from '@/domain/entities/user.entity';
import { User } from '../entities/user.entity';
import { ValidationError } from '@/@core/errors/validation.error';

export class UserModelMapper {
  static toEntity(user: User): UserEntity {
    try {
      return new UserEntity(
        {
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
        },
        user.id,
      );
    } catch {
      throw new ValidationError('Error mapping user model to entity');
    }
  }
}
