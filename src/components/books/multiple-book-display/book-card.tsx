"use client";

import { ArrowUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookCardProps {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  upvotes?: number;
  description?: string;
  publishedDate?: string;
}

export default function BookCard({
  id,
  title,
  authors,
  thumbnail,
  upvotes = 0,
  description,
  publishedDate,
}: BookCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // Create a book data object
    const bookData = {
      id,
      volumeInfo: {
        title,
        authors,
        imageLinks: { thumbnail },
        upvotes,
        description,
        publishedDate,
      },
    };
    // Encode the data for URL
    const encodedData = encodeURIComponent(JSON.stringify(bookData));
    router.push(`/book/${id}?data=${encodedData}`);
  };

  return (
    <div
      className="flex gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* Book Cover */}
      <div className="flex-shrink-0">
        <img
          src={thumbnail}
          alt={title}
          className="w-32 h-48 object-cover rounded-md shadow-sm"
        />
      </div>

      {/* Book Info */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 mb-2">{authors?.join(", ")}</p>
        <div className="flex items-center gap-2">
          <ArrowUpIcon className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-500">{upvotes}</span>
        </div>
      </div>
    </div>
  );
}
