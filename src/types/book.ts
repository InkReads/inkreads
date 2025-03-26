export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    imageLinks?: {
      thumbnail: string;
    };
    upvotes?: number;
    downvotes?: number;
    publishedDate?: string;
    categories?: string[];
    pageCount?: number;
    publisher?: string;
  };
}