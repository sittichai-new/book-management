import React, { useState } from 'react';
import { BookList } from '../components/BookList';
import { BookForm } from '../components/BookForm';
import { SearchBar } from '../components/SearchBar';
import { BookStats } from '../components/BookStats';
import { apiClient } from '../lib/api';
import { CreateBookDto, Book } from '../lib/types';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [searchAuthor, setSearchAuthor] = useState<string>();
  const [searchTitle, setSearchTitle] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleSearch = (author?: string, title?: string) => {
    setSearchAuthor(author);
    setSearchTitle(title);
  };

  const handleCreateBook = async (data: CreateBookDto) => {
    try {
      setIsSubmitting(true);
      if (editingBook) {
        // Update existing book
        await apiClient.updateBook(editingBook.id, data);
        setEditingBook(null);
      } else {
        // Create new book
        await apiClient.createBook(data);
        setSearchAuthor(undefined);
        setSearchTitle(undefined);
      }
      setShowForm(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBook = async (id: number) => {
    try {
      setIsSubmitting(true);
      const book = await apiClient.getBook(id);
      setEditingBook(book);
      setShowForm(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to load book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📚 Book Management System</h1>
        <p>Manage your book collection with ease</p>
      </header>

      <main className={styles.main}>
        <div className={styles.sections}>
          {/* Stats Section */}
          <section className={styles.section}>
            <h2>Statistics</h2>
            <BookStats />
          </section>

          {/* Books Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Books</h2>
              <button
                className={styles.addBtn}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? '✕ Close' : '+ Add Book'}
              </button>
            </div>

            {showForm && (
              <div className={styles.formContainer}>
                <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
                <BookForm
                  initialData={editingBook || undefined}
                  onSubmit={handleCreateBook}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingBook(null);
                  }}
                  isLoading={isSubmitting}
                />
              </div>
            )}

            <div className={styles.searchContainer}>
              <SearchBar onSearch={handleSearch} />
            </div>

            <BookList
              author={searchAuthor}
              title={searchTitle}
              onEdit={handleEditBook}
              refreshTrigger={refreshTrigger}
            />
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Book Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
