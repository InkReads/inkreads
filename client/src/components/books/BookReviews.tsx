import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon, Trash2Icon } from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
}

interface BookReviewsProps {
  reviews: Review[];
  user: User | null;
  hasMoreReviews: boolean;
  loadingReviews: boolean;
  onReviewVote: (reviewId: string, type: 'upvote' | 'downvote') => void;
  onDeleteReview: (reviewId: string) => void;
  onLoadMore: () => void;
}

export default function BookReviews({
  reviews,
  user,
  hasMoreReviews,
  loadingReviews,
  onReviewVote,
  onDeleteReview,
  onLoadMore
}: BookReviewsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{review.username}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {user && (
                  <>
                    <Button
                      variant={review.upvotes.includes(user.uid) ? "default" : "outline"}
                      size="icon"
                      onClick={() => onReviewVote(review.id, 'upvote')}
                    >
                      <ArrowUpIcon className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[2rem] text-center">
                      {review.upvotes.length - review.downvotes.length}
                    </span>
                    <Button
                      variant={review.downvotes.includes(user.uid) ? "default" : "outline"}
                      size="icon"
                      onClick={() => onReviewVote(review.id, 'downvote')}
                    >
                      <ArrowDownIcon className="h-4 w-4" />
                    </Button>
                    
                    {user.uid === review.userId && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDeleteReview(review.id)}
                        className="ml-2"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>
          </div>
        ))}
      </div>

      {hasMoreReviews && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loadingReviews}
          >
            {loadingReviews ? 'Loading...' : 'Load More Reviews'}
          </Button>
        </div>
      )}
    </div>
  );
} 