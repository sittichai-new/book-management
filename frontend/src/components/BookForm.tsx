import React, { useState, useEffect } from 'react';
import { CreateBookDto, Book } from '../lib/types';
import styles from '../styles/BookForm.module.css';

interface BookFormProps {
  initialData?: Book;
  onSubmit: (data: CreateBookDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateBookDto>({
    isbn: initialData?.isbn || '',
    title: initialData?.title || '',
    author: initialData?.author || '',
    description: initialData?.description || '',
    pages: initialData?.pages || undefined,
    publishedDate: initialData?.publishedDate || '',
    coverImageUrl: initialData?.coverImageUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (!isValidISBN(formData.isbn)) {
      newErrors.isbn = 'Invalid ISBN format';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidISBN = (isbn: string) => {
    const cleaned = isbn.replace(/-/g, '');
    return /^(?:\d{10}|\d{13})$/.test(cleaned);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pages' ? (value ? parseInt(value, 10) : undefined) : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errors.submit && <div className={styles.error}>{errors.submit}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="isbn">ISBN *</label>
        <input
          id="isbn"
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="978-3-16-148410-0"
          disabled={isLoading}
        />
        {errors.isbn && <span className={styles.fieldError}>{errors.isbn}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Book Title"
          disabled={isLoading}
        />
        {errors.title && <span className={styles.fieldError}>{errors.title}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="author">Author *</label>
        <input
          id="author"
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author Name"
          disabled={isLoading}
        />
        {errors.author && <span className={styles.fieldError}>{errors.author}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Book description"
          rows={4}
          disabled={isLoading}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="pages">Pages</label>
          <input
            id="pages"
            type="number"
            name="pages"
            value={formData.pages || ''}
            onChange={handleChange}
            placeholder="300"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="publishedDate">Published Date</label>
          <input
            id="publishedDate"
            type="date"
            name="publishedDate"
            value={formData.publishedDate ? new Date(formData.publishedDate).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="coverImageUrl">Cover Image URL</label>
        <input
          id="coverImageUrl"
          type="url"
          name="coverImageUrl"
          value={formData.coverImageUrl || ''}
          onChange={handleChange}
          placeholder="https://example.com/cover.jpg"
          disabled={isLoading}
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Book'}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
