import { instanceToPlain } from 'class-transformer';
import { UserPresenter } from './user.presenter';

describe('UserPresenter (unit)', () => {
  const createdAt = new Date();
  const output = {
    id: '773ede8e-04e6-4fde-a4bc-5e7e859eeaa8',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'pass123',
    createdAt,
  };
  const sut = new UserPresenter(output);

  it('should be able to create a correct instance', () => {
    expect(sut.id).toBe(output.id);
    expect(sut.name).toBe(output.name);
    expect(sut.email).toBe(output.email);
    expect(sut.createdAt).toBe(output.createdAt);
  });

  it('should be able to serialize the instance to plain object', () => {
    const data = instanceToPlain(sut);

    expect(data).toStrictEqual({
      id: '773ede8e-04e6-4fde-a4bc-5e7e859eeaa8',
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: createdAt.toISOString(),
    });
  });
});
