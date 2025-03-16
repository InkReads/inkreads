"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publishedDate: string;
    description: string;
  };
}

interface BookDisplayProps {
  initialBooks: Book[];
  genreLabel: string;
}

export function BookDisplay({ initialBooks, genreLabel }: BookDisplayProps) {
  const [books] = useState<Book[]>(initialBooks);

  const getBookCoverUrl = (bookId: string) => {
    return `https://books.google.com/books/publisher/content/images/frontcover/${bookId}?fife=w400-h600&source=gbs_api`;
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No books found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {books.map((book) => (
        <Card 
          key={book.id} 
          className="group relative border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card"
        >
          <div className="space-y-3">
            <div className="aspect-[2/3] w-full overflow-hidden rounded-lg">
              <img 
                src={getBookCoverUrl(book.id)}
                alt={book.volumeInfo.title}
                className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-book.jpg';
                }}
              />
            </div>
            <CardContent className="space-y-2 p-3">
              <Badge variant="secondary" className="text-xs font-normal">
                {genreLabel}
              </Badge>
              <h3 className="font-semibold leading-tight line-clamp-2 text-sm">
                {book.volumeInfo.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
              </p>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
} 