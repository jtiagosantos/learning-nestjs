import { faker } from '@faker-js/faker/.';
import { Email } from './email.value-object';
import { EntityValidationError } from '@/@core/errors/entity-validation.error';

describe('Email Value Object (unit)', () => {
  it('should be able to create an email', () => {
    const value = faker.internet.email();
    const email = Email.create(value);

    expect(email.value).toBe(value);
  });

  it('should not be able to create an email if the email is not a string', () => {
    const value = 222 as unknown as string;

    expect(() => Email.create(value)).toThrow(
      new EntityValidationError(Email.name, 'email must be a string'),
    );
  });

  it('should not be able to create an email if the email is empty', () => {
    expect(() => Email.create('')).toThrow(
      new EntityValidationError(Email.name, 'email cannot be empty'),
    );

    expect(() => Email.create('    ')).toThrow(
      new EntityValidationError(Email.name, 'email cannot be empty'),
    );
  });

  it('should not be able to create an email if the email is longer than 255 characters', () => {
    const value = 'a'.repeat(256) + '@example.com';

    expect(() => Email.create(value)).toThrow(
      new EntityValidationError(
        Email.name,
        'email cannot be longer than 255 characters',
      ),
    );
  });

  it('should not be able to create an email if the email format is invalid', () => {
    const value = 'invalid-email';

    expect(() => Email.create(value)).toThrow(
      new EntityValidationError(Email.name, 'invalid email format'),
    );
  });

  it('should be able to compare two emails', () => {
    const value = faker.internet.email();
    const email1 = Email.create(value);
    const email2 = Email.create(value);

    expect(email1.equals(email2)).toBe(true);
  });

  it('should be able to compare two different emails', () => {
    const email1 = Email.create(faker.internet.email());
    const email2 = Email.create(faker.internet.email());

    expect(email1.equals(email2)).toBe(false);
  });

  it('should be able to convert email to string', () => {
    const value = faker.internet.email();
    const email = Email.create(value);

    expect(email.toString()).toBe(value);
  });
});
