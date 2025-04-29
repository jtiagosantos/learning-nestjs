/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserModelMapper } from './user-model.mapper';
import { ValidationError } from '@/@core/errors/validation.error';
import { UserEntity } from '@/domain/entities/user.entity';
import { TestingSetup } from '../config/testing.setup';

describe('UserModelMapper (integration)', () => {
  let typeormUserRepository: Repository<User>;
  let props: any;

  beforeAll(async () => {
    await TestingSetup.start();
  });

  beforeEach(async () => {
    await TestingSetup.sync();

    typeormUserRepository = TestingSetup.dataSource.getRepository(User);

    props = {
      id: 'fac9dcb2-8820-4c36-9df0-affeae890014',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'testpassword123',
      createdAt: new Date(),
    };
  });

  afterEach(async () => {
    await TestingSetup.drop();
  });

  afterAll(async () => {
    await TestingSetup.destroy();
  });

  it('should throw a ValidationError when mapping an invalid user model to entity', () => {
    const model: User = Object.assign(props, { name: null });

    expect(() => UserModelMapper.toEntity(model)).toThrow(
      new ValidationError('Error mapping user model to entity'),
    );
  });

  it('should be able to map a user model to entity', async () => {
    await typeormUserRepository.insert(props);
    const user = (await typeormUserRepository.findOneBy({ id: props.id }))!;

    const sut = UserModelMapper.toEntity(user);

    expect(sut).toBeInstanceOf(UserEntity);
    expect(sut.toJSON()).toStrictEqual(props);
  });
});
