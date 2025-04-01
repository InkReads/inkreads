"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, Trash2 } from "lucide-react";

interface Review {
  id: string;
  username: string;
  date: string;
  content: string;
  userId: string;
  upvotes: number;
  downvotes: number;
}

interface BookReviewsProps {
  reviews: Review[];
  user: any; // Replace with your user type
  reviewVotes: Record<string, "upvote" | "downvote" | null>;
  hasMoreReviews: boolean;
  loadingReviews: boolean;
  onReviewVote: (reviewId: string, voteType: "upvote" | "downvote") => void;
  onDeleteReview: (reviewId: string) => void;
  onLoadMore: () => void;
}

export default function BookReviews({
  reviews,
  user,
  reviewVotes,
  hasMoreReviews,
  loadingReviews,
  onReviewVote,
  onDeleteReview,
  onLoadMore,
}: BookReviewsProps) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <span className="text-gray-500">
                  by {review.username} •{" "}
                  {new Date(review.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {/* Review Voting System */}
                <div className="flex items-center gap-6">
                  {/* Review Upvote */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReviewVote(review.id, "upvote")}
                      disabled={!user}
                      className={`p-1 rounded-full transition-colors ${
                        user
                          ? "hover:bg-gray-100 cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      } ${
                        reviewVotes[review.id] === "upvote"
                          ? "text-blue-500"
                          : "text-gray-600"
                      }`}
                      title={user ? undefined : "Please login to vote"}
                    >
                      <ArrowUpIcon className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-medium">
                      {review.upvotes}
                    </span>
                  </div>

                  {/* Review Downvote */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReviewVote(review.id, "downvote")}
                      disabled={!user}
                      className={`p-1 rounded-full transition-colors ${
                        user
                          ? "hover:bg-gray-100 cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      } ${
                        reviewVotes[review.id] === "downvote"
                          ? "text-red-500"
                          : "text-gray-600"
                      }`}
                      title={user ? undefined : "Please login to vote"}
                    >
                      <ArrowDownIcon className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-medium">
                      {review.downvotes}
                    </span>
                  </div>
                </div>
              </div>
              {user && user.uid === review.userId && (
                <button
                  onClick={() => onDeleteReview(review.id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-gray-700">{review.content}</p>
          </div>
        ))}

        {hasMoreReviews && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={onLoadMore}
              disabled={loadingReviews}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loadingReviews ? "Loading..." : "Show More Reviews"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 