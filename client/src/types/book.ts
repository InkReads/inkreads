export interface BookVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail: string;
  };
  averageRating?: number;
  genre_tags?: string[];
}

export interface Book {
  id: string;
  volumeInfo: BookVolumeInfo;
  upvotes?: string[];
  downvotes?: string[];
} 