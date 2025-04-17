import { EntityNotFoundError } from './entity-not-found.error';

describe('EntityNotFoundError (unit)', () => {
  let sut: EntityNotFoundError;

  beforeEach(() => {
    sut = new EntityNotFoundError('Entity not found');
  });

  it('should create an instance of EntityNotFoundError', () => {
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(EntityNotFoundError);
  });

  it('should have the correct name', () => {
    expect(sut.name).toBe('EntityNotFoundError');
  });

  it('should have the correct message', () => {
    expect(sut.message).toBe('Entity not found');
  });
});
