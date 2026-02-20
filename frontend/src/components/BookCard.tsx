import React from 'react';
import { Book } from '../lib/types';
import styles from '../styles/BookCard.module.css';

interface BookCardProps {
  book: Book;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const formatDate = (date?: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.title} className={styles.image} />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>
        <p className={styles.isbn}>ISBN: {book.isbn}</p>
        {book.description && <p className={styles.description}>{book.description}</p>}
        <div className={styles.details}>
          {book.pages && <span>Pages: {book.pages}</span>}
          {book.publishedDate && <span>Published: {formatDate(book.publishedDate)}</span>}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(book.id)}>
          Edit
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(book.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};
