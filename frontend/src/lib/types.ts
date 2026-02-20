export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  description?: string;
  publishedDate?: Date | string;
  pages?: number;
  coverImageUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export interface CreateBookDto {
  isbn: string;
  title: string;
  author: string;
  description?: string;
  publishedDate?: Date | string;
  pages?: number;
  coverImageUrl?: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

export interface BooksResponse {
  data: Book[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface BookStats {
  totalBooks: number;
  totalPages: number;
  topAuthors: {
    author: string;
    count: number;
  }[];
}
