import { ConflictError } from './conflict.error';

describe('ConflictError (unit)', () => {
  let sut: ConflictError;

  beforeEach(() => {
    sut = new ConflictError('email already exists');
  });

  it('should create an instance of ConflictError', () => {
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(ConflictError);
  });

  it('should have the correct name', () => {
    expect(sut.name).toBe('ConflictError');
  });

  it('should have the correct message', () => {
    expect(sut.message).toBe('email already exists');
  });
});
