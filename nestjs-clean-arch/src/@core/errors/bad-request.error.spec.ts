import { BadRequestError } from './bad-request.error';

describe('BadRequestError (unit)', () => {
  let sut: BadRequestError;

  beforeEach(() => {
    sut = new BadRequestError('name is a required field');
  });

  it('should create an instance of BadRequestError', () => {
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(BadRequestError);
  });

  it('should have the correct name', () => {
    expect(sut.name).toBe('BadRequestError');
  });

  it('should have the correct message', () => {
    expect(sut.message).toBe('name is a required field');
  });
});
