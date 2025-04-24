import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react';

interface BookDisplayProps {
  book: {
    volumeInfo: {
      title: string;
      authors: string[];
      description: string;
      imageLinks: {
        thumbnail: string;
      };
      publishedDate: string;
    };
    upvotes: string[];
    downvotes: string[];
  };
  user: User | null;
  isWritingReview: boolean;
  reviewContent: string;
  onVote: (type: 'upvote' | 'downvote') => void;
  onReviewToggle: () => void;
  onReviewChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onReviewSubmit: () => void;
  submittingReview: boolean;
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
  const { volumeInfo } = book;
  const isUpvoted = user && book.upvotes?.includes(user.uid);
  const isDownvoted = user && book.downvotes?.includes(user.uid);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex gap-8">
        <img
          src={volumeInfo.imageLinks.thumbnail}
          alt={volumeInfo.title}
          className="w-48 h-72 object-cover rounded-lg shadow-lg"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{volumeInfo.title}</h1>
              <p className="text-xl text-gray-600 mb-4">
                by {volumeInfo.authors?.join(', ')}
              </p>
            </div>
            {user && (
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={() => onVote('upvote')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isUpvoted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  disabled={!user}
                >
                  <ThumbsUpIcon className="h-5 w-5" />
                  <span>{book.upvotes?.length || 0}</span>
                </button>
                <button
                  onClick={() => onVote('downvote')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isDownvoted
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  disabled={!user}
                >
                  <ThumbsDownIcon className="h-5 w-5" />
                  <span>{book.downvotes?.length || 0}</span>
                </button>
              </div>
            )}
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            {volumeInfo.description}
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Published: {new Date(volumeInfo.publishedDate).toLocaleDateString()}
          </p>

          {user && (
            <div className="mt-6">
              {isWritingReview ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write your review..."
                    value={reviewContent}
                    onChange={onReviewChange}
                    className="w-full min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={onReviewSubmit}>Submit Review</Button>
                    <Button variant="outline" onClick={onReviewToggle}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={onReviewToggle}>Write a Review</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 