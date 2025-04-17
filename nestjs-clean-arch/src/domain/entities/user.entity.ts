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
  private _name: string;
  private _email: Email;
  private _password: string;
  private _createdAt: Date;

  constructor(props: UserProps, id?: string) {
    super(props, id);

    this.validateName(props.name);
    this._name = props.name;

    this._email = Email.create(props.email);

    this.validatePassword(props.password);
    this._password = props.password;

    this._createdAt = props.createdAt ?? new Date();
    this.validateCreatedAt(this._createdAt);
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email.value;
  }

  get password() {
    return this._password;
  }

  get createdAt() {
    return this._createdAt;
  }

  updateName(value: string) {
    this.validateName(value);
    this._name = value;
  }

  updatePassword(value: string) {
    this.validatePassword(value);
    this._password = value;
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

  private validateCreatedAt(value: Date) {
    if (!(value instanceof Date)) {
      throw new EntityValidationError(
        UserEntity.name,
        'createdAt must be a date',
      );
    }
    if (isNaN(value.getTime())) {
      throw new EntityValidationError(
        UserEntity.name,
        'createdAt must be a valid date',
      );
    }
  }
}
