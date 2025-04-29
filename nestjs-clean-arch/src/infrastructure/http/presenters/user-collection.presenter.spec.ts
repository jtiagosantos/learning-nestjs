import { instanceToPlain } from 'class-transformer';
import { UserCollectionPresenter } from './user-collection.presenter';
import { PaginationPresenter } from '@/@core/presenters/pagination.presenter';
import { UserPresenter } from './user.presenter';

describe('UserCollectionPresenter (unit)', () => {
  const createdAt = new Date();
  const props = {
    id: '773ede8e-04e6-4fde-a4bc-5e7e859eeaa8',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'pass123',
    createdAt,
  };

  it('should be able to create a correct instance', () => {
    const sut = new UserCollectionPresenter({
      data: [props],
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
      total: 1,
    });

    expect(sut.meta).toBeInstanceOf(PaginationPresenter);
    expect(sut.meta).toStrictEqual(
      new PaginationPresenter({
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      }),
    );
    expect(sut.data).toStrictEqual([new UserPresenter(props)]);
  });

  it('should be able to serialize the instance to plain object', () => {
    const sut = new UserCollectionPresenter({
      data: [props],
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
      total: 1,
    });

    const data = instanceToPlain(sut);

    expect(data).toStrictEqual({
      data: [
        {
          id: '773ede8e-04e6-4fde-a4bc-5e7e859eeaa8',
          name: 'John Doe',
          email: 'john.doe@example.com',
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      },
    });
  });
});
