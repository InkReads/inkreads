import { useState, useEffect } from 'react';
import { Book } from '@/types/book';

interface BookState {
  book: Book | null;
  loading: boolean;
  error: string | null;
}

export function useBook(id: string, initialData?: string) {
  const [state, setState] = useState<BookState>({
    book: null,
    loading: true,
    error: null
  });

  const setBook = (updater: (prev: Book | null) => Book | null) => {
    setState(prev => ({
      ...prev,
      book: updater(prev.book)
    }));
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        let bookData;
        if (initialData) {
          bookData = JSON.parse(decodeURIComponent(initialData));
        } else {
          const response = await fetch(`/api/getBook?id=${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch book: ${response.status} ${response.statusText}`);
          }
          bookData = await response.json();
        }
        setState({ book: bookData, loading: false, error: null });
      } catch (error) {
        setState({ 
          book: null, 
          loading: false, 
          error: error instanceof Error ? error.message : "Failed to fetch data"
        });
      }
    };

    fetchBook();
  }, [id, initialData]);

  return { ...state, setBook };
} 