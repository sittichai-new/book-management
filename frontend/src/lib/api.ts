import { Book, BooksResponse, BookStats, CreateBookDto, UpdateBookDto } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Books endpoints
  async getBooks(
    page: number = 1,
    limit: number = 10,
    author?: string,
    title?: string,
  ): Promise<BooksResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(author && { author }),
      ...(title && { title }),
    });

    return this.request<BooksResponse>(`/books?${params}`);
  }

  async getBook(id: number): Promise<Book> {
    return this.request<Book>(`/books/${id}`);
  }

  async createBook(data: CreateBookDto): Promise<Book> {
    return this.request<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBook(id: number, data: UpdateBookDto): Promise<Book> {
    return this.request<Book>(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBook(id: number): Promise<void> {
    return this.request<void>(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats(): Promise<BookStats> {
    return this.request<BookStats>('/books/stats');
  }
}

export const apiClient = new ApiClient();
