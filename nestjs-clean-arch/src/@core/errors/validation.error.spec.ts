import { ValidationError } from './validation.error';

describe('ValidationError (unit)', () => {
  let sut: ValidationError;

  beforeEach(() => {
    sut = new ValidationError('an entity not be loaded');
  });

  it('should create an instance of ValidationError', () => {
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(ValidationError);
  });

  it('should have the correct name', () => {
    expect(sut.name).toBe('ValidationError');
  });

  it('should have the correct message', () => {
    expect(sut.message).toBe('an entity not be loaded');
  });
});
