import { UserEntity } from '@/domain/entities/user.entity';
import { UserOutput } from '../outputs/user.output';

export class UserMapper {
  static toOutput(entity: UserEntity): UserOutput {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      createdAt: entity.createdAt,
    };
  }
}
