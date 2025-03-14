"use client";

// This component is used to search for books using the Google Books API.
// It takes an optional defaultQuery prop that can be used to set the initial search query.
// The searchBooks function is used to fetch books based on the search query.
// The useEffect hook is used to call the searchBooks function when the defaultQuery prop is set.
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publishedDate: string;
    description: string;
    imageLinks: {
      thumbnail: string;
    };
  };
}

interface BookSearchProps {
  defaultQuery?: string;
}

// This is the BookSearch component that fetches books based on a search query.
export default function BookSearch({ defaultQuery = "" }: BookSearchProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchBooks = async (searchQuery: string) => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search-books?query=${encodeURIComponent(searchQuery)}`
      );
      console.log("API Response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Books data:", data);
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (defaultQuery) {
      searchBooks(defaultQuery);
    }
  }, [defaultQuery]);

  return (
    <div className="grid grid-cols-3 gap-6">
      {books.map((book) => (
        <div className="flex flex-col justify-centeritems-center" key={book.id}>
          <div className="relative h-64 w-full">
            {book.volumeInfo.imageLinks?.thumbnail && (
              <Image
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                quality={100}
                width={150}
                height={200}
              />
            )}
          </div>
          <Card
          className="overflow-hidden hover:shadow-lg transition-shadow w-48"
        >
          <CardHeader className="p-4">
            <div className="text-sm text-blue-600 mb-2">Fiction</div>
            <CardTitle className="text-lg line-clamp-2">
              {book.volumeInfo.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4">
            <p className="text-gray-600 text-sm">
              {book.volumeInfo.authors?.join(", ")}
            </p>
          </CardContent>
        </Card>
        </div>
      ))}
      {loading && (
        <div className="col-span-full text-center py-8">Loading...</div>
      )}
      {error && (
        <div className="col-span-full text-center text-red-500 py-8">
          {error}
        </div>
      )}
    </div>
  );
}
