import { BcryptjsHashProvider } from './bcryptjs.provider';

describe('BcryptjsHashProvider (unit)', () => {
  let sut: BcryptjsHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider();
  });

  it('should be able to generate a hash', async () => {
    const payload = '123456';
    const hash = await sut.generateHash(payload);

    expect(hash).toBeDefined();
    expect(hash).not.toEqual(payload);
  });

  it('should be able to return false when comparing a hash with a different payload', async () => {
    const payload = '123456';
    const hash = await sut.generateHash(payload);

    const isEqual = await sut.compareHash('654321', hash);

    expect(isEqual).toBeFalsy();
  });

  it('should be able to return true when comparing a hash with the same payload', async () => {
    const payload = '123456';
    const hash = await sut.generateHash(payload);

    const isEqual = await sut.compareHash(payload, hash);

    expect(isEqual).toBeTruthy();
  });
});
