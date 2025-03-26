"use client";

import { useState, useEffect } from "react";
import BookCard from "./book-card";
import { getVotes } from "@/lib/firebase/votes";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks: {
      thumbnail: string;
    };
    upvotes?: number;
    description?: string;
    publishedDate?: string;
  };
}

interface BookDisplayProps {
  defaultQuery?: string;
}

export default function BookDisplay({ defaultQuery = "" }: BookDisplayProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const searchBooks = async (searchQuery: string) => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/search-book?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();

      // Fetch vote counts for each book
      const booksWithVotes = await Promise.all(
        (data.items || []).map(async (book: Book) => {
          const voteData = await getVotes("book", book.id);
          return {
            ...book,
            volumeInfo: {
              ...book.volumeInfo,
              upvotes: voteData.upvoters.length,
            },
          };
        })
      );

      setBooks(booksWithVotes);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBookCoverUrl = (bookId: string) => {
    return `https://books.google.com/books/publisher/content/images/frontcover/${bookId}?fife=w400-h600&source=gbs_api`;
  };

  useEffect(() => {
    if (defaultQuery) {
      searchBooks(defaultQuery);
    }
  }, [defaultQuery]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">Loading books...</div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.volumeInfo.title}
              authors={book.volumeInfo.authors || []}
              thumbnail={getBookCoverUrl(book.id)}
              upvotes={book.volumeInfo.upvotes}
              description={book.volumeInfo.description}
              publishedDate={book.volumeInfo.publishedDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
