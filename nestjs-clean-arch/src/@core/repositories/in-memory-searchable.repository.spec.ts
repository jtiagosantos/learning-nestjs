import { Entity } from '../base/entity.base';
import { InMemorySearchableRepository } from './in-memory-searchable.repository';
import { SearchParams, SearchResult } from '../base/searchable-repository.base';

interface StubProps {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  searchableFields: string[] = ['name'];

  protected async applyFilter(
    data: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return data;
    }

    return data.filter(item => {
      return item.toJSON().name.toLowerCase().includes(filter.toLowerCase());
    });
  }
}

describe('InMemorySearchableRepository (unit)', () => {
  let sut: StubInMemorySearchableRepository;

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('should not be able to filter data when it is not provided', async () => {
      const data = [new StubEntity({ name: 'test', price: 1 })];
      const spyFilterMethod = jest.spyOn(data, 'filter');

      const filteredData = await sut['applyFilter'](data, null);

      expect(filteredData).toStrictEqual(data);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should be able to filter data when it is provided', async () => {
      const data = [
        new StubEntity({ name: 'test', price: 1 }),
        new StubEntity({ name: 'TEST', price: 2 }),
        new StubEntity({ name: 'fake', price: 3 }),
      ];
      const spyFilterMethod = jest.spyOn(data, 'filter');

      let filteredData = await sut['applyFilter'](data, 'TEST');
      expect(filteredData).toStrictEqual([data[0], data[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      filteredData = await sut['applyFilter'](data, 'test');
      expect(filteredData).toStrictEqual([data[0], data[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      filteredData = await sut['applyFilter'](data, 'no-filter');
      expect(filteredData).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {
    it('should not be able to sort data when params are not provided', async () => {
      const data = [
        new StubEntity({ name: 'b', price: 1 }),
        new StubEntity({ name: 'a', price: 2 }),
      ];
      const sortedData = await sut['applySort'](data, null, null);

      expect(sortedData).toStrictEqual(data);
    });

    it('should not be able to sort data when the method receives an unexpected param', async () => {
      const data = [
        new StubEntity({ name: 'b', price: 1 }),
        new StubEntity({ name: 'a', price: 2 }),
      ];
      const sortedData = await sut['applySort'](data, 'price', 'asc');

      expect(sortedData).toStrictEqual(data);
    });

    it('should be able to sort data when the method receives a valid param', async () => {
      const data = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
      ];

      let sortedData = await sut['applySort'](data, 'name', 'asc');
      expect(sortedData).toStrictEqual([data[1], data[0], data[2]]);
      expect(sortedData[0].toJSON().name).toBe('a');
      expect(sortedData[1].toJSON().name).toBe('b');
      expect(sortedData[2].toJSON().name).toBe('c');

      sortedData = await sut['applySort'](data, 'name', 'desc');
      expect(sortedData).toStrictEqual([data[2], data[0], data[1]]);
      expect(sortedData[0].toJSON().name).toBe('c');
      expect(sortedData[1].toJSON().name).toBe('b');
      expect(sortedData[2].toJSON().name).toBe('a');
    });
  });

  describe('applyPaginate method', () => {
    it('should be able to paginate data', async () => {
      const data = [
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
        new StubEntity({ name: 'd', price: 50 }),
        new StubEntity({ name: 'e', price: 50 }),
      ];

      let paginatedData = await sut['applyPaginate'](data, 1, 2);
      expect(paginatedData).toHaveLength(2);
      expect(paginatedData).toStrictEqual([data[0], data[1]]);

      paginatedData = await sut['applyPaginate'](data, 2, 2);
      expect(paginatedData).toHaveLength(2);
      expect(paginatedData).toStrictEqual([data[2], data[3]]);

      paginatedData = await sut['applyPaginate'](data, 3, 2);
      expect(paginatedData).toHaveLength(1);
      expect(paginatedData).toStrictEqual([data[4]]);

      paginatedData = await sut['applyPaginate'](data, 4, 2);
      expect(paginatedData).toHaveLength(0);
      expect(paginatedData).toStrictEqual([]);
    });
  });

  describe('search method', () => {
    it('should be able to apply only pagination when the other params are null', async () => {
      const entity = new StubEntity({ name: 'test', price: 50 });
      const data = Array(16).fill(entity);

      //@ts-expect-error only for testing
      sut['data'] = data;

      const result = await sut.search(new SearchParams());

      expect(result).toStrictEqual(
        new SearchResult({
          data: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
        }),
      );
    });

    it('should be able to apply pagination and filter', async () => {
      const data = [
        new StubEntity({ name: 'test', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'TeSt', price: 50 }),
      ];

      //@ts-expect-error only for testing
      sut['data'] = data;

      let result = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: 'TEST',
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          data: [data[0], data[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        }),
      );

      result = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          filter: 'TEST',
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          data: [data[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        }),
      );
    });

    it('should be able to apply pagination and sort', async () => {
      const data = [
        new StubEntity({ name: 'b', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'd', price: 50 }),
        new StubEntity({ name: 'e', price: 50 }),
        new StubEntity({ name: 'c', price: 50 }),
      ];

      //@ts-expect-error only for testing
      sut['data'] = data;

      let result = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          data: [data[3], data[2]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        }),
      );

      result = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          data: [data[4], data[0]],
          total: 5,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        }),
      );

      result = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          data: [data[1], data[0]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      );

      result = await sut.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          data: [data[3]],
          total: 5,
          currentPage: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      );
    });

    it('should be able to apply pagination, filter and sort', async () => {
      const data = [
        new StubEntity({ name: 'test', price: 50 }),
        new StubEntity({ name: 'a', price: 50 }),
        new StubEntity({ name: 'TEST', price: 50 }),
        new StubEntity({ name: 'e', price: 50 }),
        new StubEntity({ name: 'TeSt', price: 50 }),
      ];

      //@ts-expect-error only for testing
      sut['data'] = data;

      let result = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          filter: 'TEST',
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          data: [data[0], data[4]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: 'TEST',
        }),
      );

      result = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          filter: 'TEST',
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          data: [data[2]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: 'TEST',
        }),
      );
    });
  });
});
