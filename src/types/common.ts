export type DateTimeISO = string; //ex: '2024-08-07T17:22:55.124Z'

export type PaginationMetadata = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type PaginatedResponse<T> = {
  metadata: PaginationMetadata;
  items: T[];
};
