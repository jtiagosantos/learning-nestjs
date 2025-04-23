import { UserEntity } from '@/domain/entities/user.entity';
import { UserPropsMaker } from '@/domain/helpers/user-props-maker.helper';
import { UserMapper } from './user.mapper';

describe('UserMapper (unit)', () => {
  it('should be able to map a UserEntity to UserOutput', () => {
    const entity = new UserEntity(UserPropsMaker.make());

    const sut = UserMapper.toOutput(entity);

    expect(sut).toStrictEqual({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      createdAt: entity.createdAt,
    });
  });
});
