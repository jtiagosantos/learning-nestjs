import { Entity } from './entity.base';
import { Repository } from './repository.base';

export type SortDirection = 'asc' | 'desc';

export interface SearchProps<Filter = string> {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter;
}

export interface SearchResultProps<E extends Entity, Filter> {
  data: E[];
  total: number;
  currentPage: number;
  perPage: number;
  sort: string | null;
  sortDir: SortDirection | null;
  filter: Filter | null;
}

export class SearchParams<Filter = string> {
  protected _page: number;
  protected _perPage: number;
  protected _sort: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page ?? 1;
    this.perPage = props.perPage ?? 15;
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = value === (true as unknown) ? this._page : +value;

    if (isNaN(_page) || _page <= 0 || parseInt(_page.toString()) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  get perPage() {
    return this._perPage;
  }

  private set perPage(value: number) {
    let _perPage = value === (true as unknown) ? this._perPage : +value;

    if (
      isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage.toString()) !== _perPage
    ) {
      _perPage = 15;
    }

    this._perPage = _perPage;
  }

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }

  get sortDir() {
    return this._sortDir;
  }

  private set sortDir(value: SortDirection | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }

    const dir = `${value}`.toLowerCase();
    this._sortDir = dir === 'asc' || dir === 'desc' ? dir : 'desc';
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined || value === ''
        ? null
        : (`${value}` as Filter);
  }
}

export class SearchResult<E extends Entity, Filter = string> {
  readonly data: E[];
  readonly total: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly lastPage: number;
  readonly sort: string | null;
  readonly sortDir: SortDirection | null;
  readonly filter: Filter | null;

  constructor(props: SearchResultProps<E, Filter>) {
    this.data = props.data;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = Math.ceil(this.total / this.perPage);
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }

  toJSON(forceJSON = false) {
    return {
      data: forceJSON ? this.data.map(item => item.toJSON()) : this.data,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDir: this.sortDir,
      filter: this.filter,
    };
  }
}

export interface SearchableRepository<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<E, Filter>,
> extends Repository<E> {
  sortableFields: string[];
  search(input: SearchInput): Promise<SearchOutput>;
}
