export interface PaginationOutput<Data = any> {
  data: Data[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
}
