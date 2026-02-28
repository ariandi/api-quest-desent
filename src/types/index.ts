export interface Book {
  id: number;
  title: string;
  author: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}

export interface TokenResponse {
  token: string;
}

export interface BooksQueryParams {
  author?: string;
  page?: string;
  limit?: string;
}
