import { HashProvider } from '@/@core/providers/hash.provider';
import { compare, hash } from 'bcryptjs';

export class BcryptjsHashProvider implements HashProvider {
  async generateHash(payload: string) {
    const SALT = 6;

    return hash(payload, SALT);
  }

  async compareHash(payload: string, hash: string) {
    return compare(payload, hash);
  }
}
