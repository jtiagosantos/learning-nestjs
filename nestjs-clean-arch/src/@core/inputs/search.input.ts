import { SortDirection } from '../base/searchable-repository.base';

export interface SearchInput<Filter = string> {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter;
}
