import { Entity } from '../base/entity.base';
import {
  SearchableRepository,
  SearchParams,
  SearchResult,
} from '../base/searchable-repository.base';
import { InMemoryRepository } from './in-memory.repository';

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepository<E, any, any>
{
  sortableFields: string[] = [];

  async search(params: SearchParams): Promise<SearchResult<E>> {
    const filteredData = await this.applyFilter(this.data, params.filter);
    const sortedData = await this.applySort(
      filteredData,
      params.sort,
      params.sortDir,
    );
    const paginatedData = await this.applyPaginate(
      sortedData,
      params.page,
      params.perPage,
    );

    return new SearchResult({
      data: paginatedData,
      total: filteredData.length,
      currentPage: params.page,
      perPage: params.perPage,
      sort: params.sort,
      sortDir: params.sortDir,
      filter: params.filter,
    });
  }

  protected abstract applyFilter(
    data: E[],
    filter: string | null,
  ): Promise<E[]>;

  protected async applySort(
    data: E[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = (a.toJSON() as Record<string, unknown>)[sort] as
        | string
        | number;
      const bValue = (b.toJSON() as Record<string, unknown>)[sort] as
        | string
        | number;

      if (aValue < bValue) {
        return sortDir === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  protected async applyPaginate(
    data: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return data.slice(start, end);
  }
}
