export interface CardList<T> {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: T[] ;
}