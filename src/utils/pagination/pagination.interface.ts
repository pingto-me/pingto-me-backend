export interface Pagination<T> {
  results?: T[];
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
}
