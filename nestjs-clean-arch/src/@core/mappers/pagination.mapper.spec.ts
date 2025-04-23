import { SearchResult } from '../base/searchable-repository.base';
import { PaginationMapper } from './pagination.mapper';

describe('PaginationMapper (unit)', () => {
  it('should be able to map search result to pagination output', () => {
    const result = new SearchResult({
      data: ['fake'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: null,
      sortDir: null,
      filter: 'fake',
    });

    const sut = PaginationMapper.toOutput(result.data, result);

    expect(sut).toStrictEqual({
      data: ['fake'],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    });
  });
});
