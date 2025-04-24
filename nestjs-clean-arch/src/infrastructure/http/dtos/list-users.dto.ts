import { SortDirection } from '@/@core/base/searchable-repository.base';
import { SearchInput } from '@/@core/inputs/search.input';
import { IsOptional } from 'class-validator';

export class ListUsersDTO implements SearchInput {
  @IsOptional()
  page?: number;

  @IsOptional()
  perPage?: number;

  @IsOptional()
  sort?: string;

  @IsOptional()
  sortDir?: SortDirection;

  @IsOptional()
  filter?: string;
}
