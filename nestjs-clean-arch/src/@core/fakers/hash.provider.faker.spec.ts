import { HashProviderFaker } from './hash.provider.faker';

describe('HashProviderFaker (unit)', () => {
  let sut: HashProviderFaker;

  beforeEach(() => {
    sut = new HashProviderFaker();
  });

  it('should be able to generate a hash', async () => {
    const payload = 'password';
    const hash = await sut.generateHash(payload);

    expect(hash).toBe(`hashed-${payload}`);
  });

  it('should be able to compare a hash', async () => {
    const payload = 'password';
    const hash = await sut.generateHash(payload);

    const isMatch = await sut.compareHash(payload, hash);
    expect(isMatch).toBeTruthy();

    const isNotMatch = await sut.compareHash('wrongPassword', hash);
    expect(isNotMatch).toBeFalsy();
  });
});
