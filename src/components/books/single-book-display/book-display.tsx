import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import WriteBookReview from "./write-book-review";

interface BookDisplayProps {
  book: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description: string;
      imageLinks?: {
        thumbnail: string;
      };
      upvotes?: number;
      downvotes?: number;
    };
  };
  user: any; // Replace with your user type
  isWritingReview: boolean;
  reviewContent: string;
  onVote: (type: "upvote" | "downvote") => void;
  onReviewToggle: () => void;
  onReviewChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onReviewSubmit: () => void;
}

export default function BookDisplay({
  book,
  user,
  isWritingReview,
  reviewContent,
  onVote,
  onReviewToggle,
  onReviewChange,
  onReviewSubmit
}: BookDisplayProps) {
  // Helper function to clean HTML from text
  const cleanDescription = (html: string): string => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    let text = temp.textContent || temp.innerText || "";
    text = text.replace(/\s+/g, " ");
    return text;
  };
  
  const getBookCoverUrl = (bookId: string) => {
    return `https://books.google.com/books/publisher/content/images/frontcover/${bookId}?fife=w400-h600&source=gbs_api`;
  };


  return (
    <div className="flex gap-8">
      {/* Book Cover */}
      <div className="flex-shrink-0">
        <img
          src={getBookCoverUrl(book.id)}
          alt={book.volumeInfo.title}
          className="w-64 h-96 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Book Info */}
      <div className="flex-grow">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {book.volumeInfo.title}
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          by {book.volumeInfo.authors?.join(", ")}
        </p>
        <div className="prose max-w-none mb-6">
          <p className="text-gray-700">
            {cleanDescription(book.volumeInfo.description) ||
              "No description available."}
          </p>
        </div>

        {/* Voting System */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Upvote */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onVote("upvote")}
                disabled={!user}
                className={`p-1 rounded-full transition-colors ${
                  user
                    ? "hover:bg-gray-100 cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
                title={user ? undefined : "Please login to vote"}
              >
                <ArrowUpIcon className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-lg font-medium">
                {book.volumeInfo.upvotes}
              </span>
            </div>

            {/* Downvote */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onVote("downvote")}
                disabled={!user}
                className={`p-1 rounded-full transition-colors ${
                  user
                    ? "hover:bg-gray-100 cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
                title={user ? undefined : "Please login to vote"}
              >
                <ArrowDownIcon className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-lg font-medium">
                {book.volumeInfo.downvotes}
              </span>
            </div>
          </div>

          <WriteBookReview
            isWritingReview={isWritingReview}
            reviewContent={reviewContent}
            onReviewToggle={onReviewToggle}
            onReviewChange={onReviewChange}
            onReviewSubmit={onReviewSubmit}
            isLoggedIn={!!user}
          />
        </div>
      </div>
    </div>
  );
} 