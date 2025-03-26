import { useState, useEffect } from 'react';
import { Review, addReview, getBookReviews, deleteReview } from '@/lib/firebase/reviews';
import { handleVote } from '@/lib/firebase/votes';

interface ReviewState {
  reviews: Review[];
  isWritingReview: boolean;
  reviewContent: string;
  reviewVotes: Record<string, "upvote" | "downvote" | null>;
  hasMoreReviews: boolean;
  loadingReviews: boolean;
}

export function useReviews(bookId: string) {
  const [state, setState] = useState<ReviewState>({
    reviews: [],
    isWritingReview: false,
    reviewContent: "",
    reviewVotes: {},
    hasMoreReviews: false,
    loadingReviews: false
  });

  const handleSubmitReview = async (userId: string, username: string) => {
    if (!bookId || !state.reviewContent.trim()) return;
    try {
      const newReview = {
        userId,
        username: username || "Anonymous",
        content: state.reviewContent.trim(),
        date: new Date().toISOString(),
        bookId,
        upvotes: 0,
        downvotes: 0,
      };
      const savedReview = await addReview(newReview);
      setState(prev => ({
        ...prev,
        reviews: [savedReview, ...prev.reviews],
        reviewContent: "",
        isWritingReview: false
      }));
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleReviewVote = async (reviewId: string, userId: string, voteType: "upvote" | "downvote") => {
    try {
      const result = await handleVote("review", reviewId, userId, voteType);
      setState(prev => ({
        ...prev,
        reviews: prev.reviews.map(review => 
          review.id === reviewId 
            ? { ...review, upvotes: result.upvotes, downvotes: result.downvotes }
            : review
        )
      }));
    } catch (error) {
      console.error("Error voting on review:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      setState(prev => ({
        ...prev,
        reviews: prev.reviews.filter(review => review.id !== reviewId)
      }));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const loadMoreReviews = async () => {
    if (state.loadingReviews) return;
    setState(prev => ({ ...prev, loadingReviews: true }));
    try {
      const lastReview = state.reviews[state.reviews.length - 1];
      const result = await getBookReviews(bookId, lastReview);
      setState(prev => ({
        ...prev,
        reviews: [...prev.reviews, ...result.reviews],
        hasMoreReviews: result.hasMore,
        loadingReviews: false
      }));
    } catch (error) {
      console.error("Error loading more reviews:", error);
      setState(prev => ({ ...prev, loadingReviews: false }));
    }
  };

  // Load initial reviews
  useEffect(() => {
    const fetchInitialReviews = async () => {
      try {
        const result = await getBookReviews(bookId);
        setState(prev => ({
          ...prev,
          reviews: result.reviews,
          hasMoreReviews: result.hasMore
        }));
      } catch (error) {
        console.error("Error fetching initial reviews:", error);
      }
    };

    if (bookId) {
      fetchInitialReviews();
    }
  }, [bookId]);

  return {
    ...state,
    setReviewContent: (content: string) => 
      setState(prev => ({ ...prev, reviewContent: content })),
    toggleWritingReview: () => 
      setState(prev => ({ ...prev, isWritingReview: !prev.isWritingReview })),
    handleSubmitReview,
    handleReviewVote,
    handleDeleteReview,
    loadMoreReviews
  };
} 