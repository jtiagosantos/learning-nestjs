import { faker } from '@faker-js/faker';
import { UserEntity, UserProps } from './user.entity';
import { UserPropsMaker } from '../helpers/user-props-maker.helper';
import { EntityValidationError } from '@/@core/errors/entity-validation.error';

describe('UserEntity (unit)', () => {
  let props: UserProps;
  let sut: UserEntity;

  beforeEach(() => {
    props = UserPropsMaker.make();

    sut = new UserEntity(props);
  });

  it('should be able to create an instance of UserEntity', () => {
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(UserEntity);
  });

  it('should not be able to create a user with a name that is not a string', () => {
    expect(() => {
      props.name = faker.number.int() as unknown as string;
      return new UserEntity(props);
    }).toThrow(`validation error in ${UserEntity.name}: name must be a string`);
  });

  it('should not be able to create a user with an empty name', () => {
    const props = UserPropsMaker.make();

    expect(() => {
      props.name = '';
      return new UserEntity(props);
    }).toThrow(`validation error in ${UserEntity.name}: name cannot be empty`);

    expect(() => {
      props.name = '   ';
      return new UserEntity(props);
    }).toThrow(`validation error in ${UserEntity.name}: name cannot be empty`);
  });

  it('should not be able to create a user with a name that is longer than 255 characters', () => {
    const props = UserPropsMaker.make({
      name: faker.lorem.paragraph(256),
    });

    expect(() => new UserEntity(props)).toThrow(
      `validation error in ${UserEntity.name}: name cannot be longer than 255 characters`,
    );
  });

  it('should not be able to create a user with a password that is not a string', () => {
    expect(() => {
      props.password = faker.number.int() as unknown as string;
      return new UserEntity(props);
    }).toThrow(
      `validation error in ${UserEntity.name}: password must be a string`,
    );
  });

  it('should not be able to create a user with an empty password', () => {
    const props = UserPropsMaker.make();

    expect(() => {
      props.password = '';
      return new UserEntity(props);
    }).toThrow(
      `validation error in ${UserEntity.name}: password cannot be empty`,
    );

    expect(() => {
      props.password = '   ';
      return new UserEntity(props);
    }).toThrow(
      `validation error in ${UserEntity.name}: password cannot be empty`,
    );
  });

  it('should not be able to create a user with a password that is longer than 100 characters', () => {
    const props = UserPropsMaker.make({
      password: faker.lorem.paragraph(101),
    });

    expect(() => new UserEntity(props)).toThrow(
      `validation error in ${UserEntity.name}: password cannot be longer than 100 characters`,
    );
  });

  it('should be able to get the name value by the getter of name', () => {
    expect(sut.name).toBeDefined();
    expect(typeof sut.name).toBe('string');
    expect(sut.name).toBe(props.name);
  });

  it('should be able to get the email value by the getter of email', () => {
    expect(sut.email).toBeDefined();
    expect(typeof sut.email).toBe('string');
    expect(sut.email).toBe(props.email);
  });

  it('should be able to get the password value by the getter of password', () => {
    expect(sut.password).toBeDefined();
    expect(typeof sut.password).toBe('string');
    expect(sut.password).toBe(props.password);
  });

  it('should be able to get the createdAt value by the getter of createdAt', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.createdAt).toEqual(props.createdAt);
  });

  it('should be able to update the name value', () => {
    const newName = faker.person.fullName();

    sut.updateName(newName);

    expect(sut.name).toBe(newName);
  });

  it('should not be able to update the name with a value that is not a string', () => {
    expect(() =>
      sut.updateName(faker.number.int() as unknown as string),
    ).toThrow(
      new EntityValidationError(UserEntity.name, 'name must be a string'),
    );
  });

  it('should not be able to update the name with an empty value', () => {
    expect(() => sut.updateName('')).toThrow(
      new EntityValidationError(UserEntity.name, 'name cannot be empty'),
    );

    expect(() => sut.updateName('   ')).toThrow(
      new EntityValidationError(UserEntity.name, 'name cannot be empty'),
    );
  });

  it('should not be able to update the name with a value that is longer than 255 characters', () => {
    expect(() => sut.updateName(faker.lorem.paragraph(256))).toThrow(
      new EntityValidationError(
        UserEntity.name,
        'name cannot be longer than 255 characters',
      ),
    );
  });

  it('should not be able to update the password with a value that is not a string', () => {
    expect(() =>
      sut.updatePassword(faker.number.int() as unknown as string),
    ).toThrow(
      new EntityValidationError(UserEntity.name, 'password must be a string'),
    );
  });

  it('should be able to update the password value', () => {
    const newPassword = faker.internet.password();

    sut.updatePassword(newPassword);

    expect(sut.password).toBe(newPassword);
  });

  it('should not be able to update the password with a value that is not a string', () => {
    expect(() =>
      sut.updatePassword(faker.number.int() as unknown as string),
    ).toThrow(
      new EntityValidationError(UserEntity.name, 'password must be a string'),
    );
  });

  it('should not be able to update the password with an empty value', () => {
    expect(() => sut.updatePassword('')).toThrow(
      new EntityValidationError(UserEntity.name, 'password cannot be empty'),
    );

    expect(() => sut.updatePassword('   ')).toThrow(
      new EntityValidationError(UserEntity.name, 'password cannot be empty'),
    );
  });

  it('should not be able to update the password with a value that is longer than 100 characters', () => {
    expect(() => sut.updatePassword(faker.lorem.paragraph(101))).toThrow(
      new EntityValidationError(
        UserEntity.name,
        'password cannot be longer than 100 characters',
      ),
    );
  });
});
