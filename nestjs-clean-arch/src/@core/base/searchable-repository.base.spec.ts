import {
  SearchParams,
  SearchResult,
  SortDirection,
} from './searchable-repository.base';

describe('SearchableRepository (unit)', () => {
  describe('SearchParams', () => {
    it('should be able to attrribute correct value for page when it is not provided', () => {
      const sut = new SearchParams();

      expect(sut.page).toBe(1);
    });

    it('should be able to attrribute correct value for page when it is provided', () => {
      const params = [
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
        { page: '', expected: 1 },
        { page: 'any', expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.5, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: [], expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ];

      params.forEach(param => {
        const sut = new SearchParams({ page: param.page as unknown as number });

        expect(sut.page).toBe(param.expected);
      });
    });

    it('should be able to attrribute correct value for perPage when it is not provided', () => {
      const sut = new SearchParams();

      expect(sut.perPage).toBe(15);
    });

    it('should be able to attrribute correct value for perPage when it is provided', () => {
      const params = [
        { perPage: null, expected: 15 },
        { perPage: undefined, expected: 15 },
        { perPage: '', expected: 15 },
        { perPage: 'any', expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: -15, expected: 15 },
        { perPage: 5.5, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: [], expected: 15 },
        { perPage: 1, expected: 1 },
        { perPage: 2, expected: 2 },
        { perPage: 25, expected: 25 },
      ];

      params.forEach(param => {
        const sut = new SearchParams({
          perPage: param.perPage as unknown as number,
        });

        expect(sut.perPage).toBe(param.expected);
      });
    });

    it('should be able to attrribute correct value for sort when it is not provided', () => {
      const sut = new SearchParams();

      expect(sut.sort).toBeNull();
    });

    it('should be able to attrribute correct value for sort when it is provided', () => {
      const params = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: '', expected: null },
        { sort: 'any', expected: 'any' },
        { sort: 0, expected: '0' },
        { sort: '-1', expected: '-1' },
        { sort: 5.5, expected: '5.5' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
        { sort: [], expected: '' },
        { sort: 1, expected: '1' },
        { sort: 2, expected: '2' },
        { sort: 25, expected: '25' },
      ];

      params.forEach(param => {
        const sut = new SearchParams({
          sort: param.sort as unknown as string,
        });

        expect(sut.sort).toBe(param.expected);
      });
    });

    it('should be able to attrribute correct value for sortDir when sort it is not provided', () => {
      let sut = new SearchParams();
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: null });
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: undefined });
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: '' });
      expect(sut.sortDir).toBeNull();
    });

    it('should be able to attrribute correct value for sortDir when sort it is not provided and sortDir it is not provided', () => {
      const sut = new SearchParams({
        sort: 'any',
      });

      expect(sut.sortDir).toBe('desc');
    });

    it('should be able to attrribute correct value for sortDir when sort and sortDir are provided', () => {
      const params = [
        { sortDir: null, expected: 'desc' },
        { sortDir: undefined, expected: 'desc' },
        { sortDir: '', expected: 'desc' },
        { sortDir: 'any', expected: 'desc' },
        { sortDir: 0, expected: 'desc' },
        { sortDir: 'asc', expected: 'asc' },
        { sortDir: 'desc', expected: 'desc' },
        { sortDir: 'ASC', expected: 'asc' },
        { sortDir: 'DESC', expected: 'desc' },
      ];

      params.forEach(param => {
        const sut = new SearchParams({
          sort: 'any',
          sortDir: param.sortDir as unknown as SortDirection,
        });

        expect(sut.sortDir).toBe(param.expected);
      });
    });

    it('should be able to attrribute correct value for filter when it is not provided', () => {
      const sut = new SearchParams();

      expect(sut.filter).toBeNull();
    });

    it('should be able to attrribute correct value for filter when it is provided', () => {
      const params = [
        { filter: null, expected: null },
        { filter: undefined, expected: null },
        { filter: '', expected: null },
        { filter: 'any', expected: 'any' },
        { filter: 0, expected: '0' },
        { filter: '-1', expected: '-1' },
        { filter: 5.5, expected: '5.5' },
        { filter: true, expected: 'true' },
        { filter: false, expected: 'false' },
        { filter: {}, expected: '[object Object]' },
        { filter: [], expected: '' },
        { filter: 1, expected: '1' },
        { filter: 2, expected: '2' },
        { filter: 25, expected: '25' },
      ];

      params.forEach(param => {
        const sut = new SearchParams({
          filter: param.filter as unknown as string,
        });

        expect(sut.filter).toBe(param.expected);
      });
    });
  });

  describe('SearchResult', () => {
    it('should be able to return the correct result', () => {
      const sut = new SearchResult({
        data: ['test1', 'test2', 'test3', 'test4'] as any[],
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });

      expect(sut.toJSON()).toStrictEqual({
        data: ['test1', 'test2', 'test3', 'test4'],
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });
    });

    it('should be able the toJSON method to return the correct values', () => {
      const sut = new SearchResult({
        data: ['test1', 'test2', 'test3', 'test4'] as any[],
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      });

      expect(sut.toJSON()).toStrictEqual({
        data: ['test1', 'test2', 'test3', 'test4'],
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      });
    });

    it('should be able to return the correct value for the lastPage property', () => {
      let sut = new SearchResult({
        data: ['test1', 'test2', 'test3', 'test4'] as any[],
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });
      expect(sut.lastPage).toBe(2);

      sut = new SearchResult({
        data: ['test1', 'test2', 'test3', 'test4'] as any[],
        total: 13,
        currentPage: 1,
        perPage: 4,
        sort: null,
        sortDir: null,
        filter: null,
      });
      expect(sut.lastPage).toBe(4);

      sut = new SearchResult({
        data: ['test1', 'test2', 'test3', 'test4'] as any[],
        total: 27,
        currentPage: 1,
        perPage: 30,
        sort: null,
        sortDir: null,
        filter: null,
      });
      expect(sut.lastPage).toBe(1);
    });
  });
});
