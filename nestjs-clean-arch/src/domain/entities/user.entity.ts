import { Entity } from '@/@core/base/entity.base';
import { Email } from '../value-objects/email.value-object';
import { EntityValidationError } from '@/@core/errors/entity-validation.error';

export interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

export class UserEntity extends Entity<UserProps> {
  constructor(props: UserProps, id?: string) {
    super(props, id);

    this.validateName(props.name);

    Email.create(props.email);

    this.validatePassword(props.password);
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  updateName(value: string) {
    this.validateName(value);
    this.props.name = value;
  }

  updatePassword(value: string) {
    this.validatePassword(value);
    this.props.password = value;
  }

  private validateName(value: string) {
    if (typeof value !== 'string') {
      throw new EntityValidationError(UserEntity.name, 'name must be a string');
    }
    if (value === '' || value.trim() === '') {
      throw new EntityValidationError(UserEntity.name, 'name cannot be empty');
    }
    if (value.length > 255) {
      throw new EntityValidationError(
        UserEntity.name,
        'name cannot be longer than 255 characters',
      );
    }
  }

  private validatePassword(value: string) {
    if (typeof value !== 'string') {
      throw new EntityValidationError(
        UserEntity.name,
        'password must be a string',
      );
    }
    if (value === '' || value.trim() === '') {
      throw new EntityValidationError(
        UserEntity.name,
        'password cannot be empty',
      );
    }
    if (value.length > 100) {
      throw new EntityValidationError(
        UserEntity.name,
        'password cannot be longer than 100 characters',
      );
    }
  }
}
