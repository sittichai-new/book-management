import React, { useState, useCallback, useEffect } from 'react';
import styles from '../styles/SearchBar.module.css';

interface SearchBarProps {
  onSearch: (author?: string, title?: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onSearch(author || undefined, title || undefined);
    }, 500);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [author, title]);

  const handleReset = () => {
    setAuthor('');
    setTitle('');
    onSearch();
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search by author..."
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className={styles.input}
        disabled={isLoading}
      />
      <input
        type="text"
        placeholder="Search by title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
        disabled={isLoading}
      />
      {(author || title) && (
        <button onClick={handleReset} className={styles.resetBtn} disabled={isLoading}>
          Reset
        </button>
      )}
    </div>
  );
};
