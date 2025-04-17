import { EntityValidationError } from '@/@core/errors/entity-validation.error';

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Email {
    this.validate(value);

    value = this.clean(value);

    return new Email(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(email: Email): boolean {
    return this._value === email.value;
  }

  private static validate(value: string) {
    if (typeof value !== 'string') {
      throw new EntityValidationError(Email.name, 'email must be a string');
    }
    if (value === '' || value.trim() === '') {
      throw new EntityValidationError(Email.name, 'email cannot be empty');
    }
    if (value.length > 255) {
      throw new EntityValidationError(
        Email.name,
        'email cannot be longer than 255 characters',
      );
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      throw new EntityValidationError(Email.name, 'invalid email format');
    }
  }

  private static clean(value: string): string {
    return value.trim();
  }
}
