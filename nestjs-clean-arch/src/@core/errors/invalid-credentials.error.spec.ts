import { InvalidCredentialsError } from './invalid-credentials.error';

describe('InvalidCredentialsError (unit)', () => {
  let sut: InvalidCredentialsError;

  beforeEach(() => {
    sut = new InvalidCredentialsError('Test error message');
  });

  it('should create an instance of InvalidCredentialsError', () => {
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should have the correct name', () => {
    expect(sut.name).toBe('InvalidCredentialsError');
  });

  it('should have the correct message', () => {
    expect(sut.message).toBe('Test error message');
  });
});
