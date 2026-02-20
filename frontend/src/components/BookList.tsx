import React, { useState, useEffect } from 'react';
import { Book } from '../lib/types';
import { apiClient } from '../lib/api';
import { BookCard } from './BookCard';
import styles from '../styles/BookList.module.css';

interface BookListProps {
  author?: string;
  title?: string;
  onEdit: (id: number) => void;
  refreshTrigger?: number;
}

export const BookList: React.FC<BookListProps> = ({
  author,
  title,
  onEdit,
  refreshTrigger = 0,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadBooks(1);
  }, [author, title, refreshTrigger]);

  const loadBooks = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getBooks(page, ITEMS_PER_PAGE, author, title);
      setBooks(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.pages);
      setTotal(response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await apiClient.deleteBook(id);
      loadBooks(currentPage);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete book');
    }
  };

  const handlePageChange = (page: number) => {
    loadBooks(page);
  };

  if (isLoading && books.length === 0) {
    return <div className={styles.loading}>Loading books...</div>;
  }

  if (error && books.length === 0) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => loadBooks(currentPage)} className={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {books.length === 0 ? (
        <div className={styles.empty}>No books found</div>
      ) : (
        <>
          <div className={styles.info}>
            <p>
              Showing {books.length} of {total} books
            </p>
          </div>
          <div className={styles.grid}>
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={styles.pageBtn}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${styles.pageBtn} ${
                    page === currentPage ? styles.active : ''
                  }`}
                  disabled={isLoading}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={styles.pageBtn}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
