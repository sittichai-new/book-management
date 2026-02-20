import React, { useState, useEffect } from 'react';
import { BookStats as BookStatsType } from '../lib/types';
import { apiClient } from '../lib/api';
import styles from '../styles/BookStats.module.css';

export const BookStats: React.FC = () => {
  const [stats, setStats] = useState<BookStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.stats}>Loading statistics...</div>;
  }

  if (error) {
    return (
      <div className={styles.stats}>
        <p className={styles.error}>{error}</p>
        <button onClick={loadStats} className={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return <div className={styles.stats}>No data available</div>;
  }

  return (
    <div className={styles.stats}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Books</h3>
          <p className={styles.statValue}>{stats.totalBooks}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Pages</h3>
          <p className={styles.statValue}>{stats.totalPages.toLocaleString()}</p>
        </div>
      </div>

      {stats.topAuthors.length > 0 && (
        <div className={styles.topAuthors}>
          <h3>Top Authors</h3>
          <ul className={styles.authorsList}>
            {stats.topAuthors.map((author) => (
              <li key={author.author} className={styles.authorItem}>
                <span className={styles.authorName}>{author.author}</span>
                <span className={styles.authorCount}>{author.count} books</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
