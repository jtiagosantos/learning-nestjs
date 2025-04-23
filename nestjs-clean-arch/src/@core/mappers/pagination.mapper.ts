import { Entity } from '../base/entity.base';
import { SearchResult } from '../base/searchable-repository.base';
import { PaginationOutput } from '../outputs/pagination.output';

export class PaginationMapper {
  static toOutput<Data = any>(
    data: Data[],
    result: SearchResult<Entity>,
  ): PaginationOutput<Data> {
    return {
      data,
      total: result.total,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      perPage: result.perPage,
    };
  }
}
