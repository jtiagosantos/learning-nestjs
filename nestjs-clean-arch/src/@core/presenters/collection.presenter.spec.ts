import { instanceToPlain } from 'class-transformer';
import { CollectionPresenter } from './colletion.presenter';
import { PaginationPresenter } from './pagination.presenter';

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3];
}

describe('CollectionPresenter (unit)', () => {
  const sut = new StubCollectionPresenter({
    currentPage: 1,
    perPage: 2,
    lastPage: 2,
    total: 4,
  });
  it('should be able to create a correct instance', () => {
    expect(sut['paginationPresenter']).toBeInstanceOf(PaginationPresenter);
    expect(sut['paginationPresenter'].currentPage).toBe(1);
    expect(sut['paginationPresenter'].perPage).toBe(2);
    expect(sut['paginationPresenter'].lastPage).toBe(2);
    expect(sut['paginationPresenter'].total).toBe(4);
  });

  it('should be able to serialize the instance to plain object', () => {
    const data = instanceToPlain(sut);

    expect(data).toStrictEqual({
      data: [1, 2, 3],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        total: 4,
      },
    });
  });
});
