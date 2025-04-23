import { HashProvider } from '../providers/hash.provider';

export class HashProviderFaker implements HashProvider {
  private readonly fakeHashes = new Map<string, string>();

  async generateHash(payload: string) {
    const fakeHash = `hashed-${payload}`;
    this.fakeHashes.set(fakeHash, payload);
    return fakeHash;
  }

  async compareHash(payload: string, hash: string) {
    return this.fakeHashes.get(hash) === payload;
  }
}
