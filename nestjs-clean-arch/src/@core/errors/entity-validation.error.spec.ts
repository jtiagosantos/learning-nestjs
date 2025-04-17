import { EntityValidationError } from './entity-validation.error';

describe('EntityValidationError (unit)', () => {
  let sut: EntityValidationError;

  beforeEach(() => {
    sut = new EntityValidationError('Entity', 'Invalid value provided');
  });

  it('should create an instance of EntityValidationError', () => {
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(EntityValidationError);
  });

  it('should have the correct name', () => {
    expect(sut.name).toBe('EntityValidationError');
  });

  it('should have the correct message', () => {
    expect(sut.message).toBe(
      'Validation error in Entity: Invalid value provided',
    );
  });
});
