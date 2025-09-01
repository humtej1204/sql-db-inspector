export interface IPaginationQuery {
  page: number;
  size: number;
  totalItems?: number;
  totalPages?: number;
  sort?: "asc" | "desc";
  sortBy: string;
}
