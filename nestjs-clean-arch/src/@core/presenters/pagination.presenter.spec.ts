import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from './pagination.presenter';

describe('PaginationPresenter (unit)', () => {
  it('should be able to create a correct instance', () => {
    const sut = new PaginationPresenter({
      currentPage: 1,
      perPage: 2,
      lastPage: 3,
      total: 4,
    });

    expect(sut.currentPage).toBe(1);
    expect(sut.perPage).toBe(2);
    expect(sut.lastPage).toBe(3);
    expect(sut.total).toBe(4);
  });

  it('should be able to create a correct instance with values as string', () => {
    const sut = new PaginationPresenter({
      currentPage: '1' as any,
      perPage: '2' as any,
      lastPage: '3' as any,
      total: '4' as any,
    });

    expect(sut.currentPage).toBe('1');
    expect(sut.perPage).toBe('2');
    expect(sut.lastPage).toBe('3');
    expect(sut.total).toBe('4');
  });

  it('should be able to serialize the instance to plain object', () => {
    let sut = new PaginationPresenter({
      currentPage: 1,
      perPage: 2,
      lastPage: 3,
      total: 4,
    });

    let data = instanceToPlain(sut);

    expect(data.currentPage).toBe(1);
    expect(data.perPage).toBe(2);
    expect(data.lastPage).toBe(3);
    expect(data.total).toBe(4);

    sut = new PaginationPresenter({
      currentPage: '1' as any,
      perPage: '2' as any,
      lastPage: '3' as any,
      total: '4' as any,
    });

    data = instanceToPlain(sut);

    expect(data.currentPage).toBe(1);
    expect(data.perPage).toBe(2);
    expect(data.lastPage).toBe(3);
    expect(data.total).toBe(4);
  });
});
