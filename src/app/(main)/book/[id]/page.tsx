"use client";

import { useAuth } from "@/context/auth-context";
import { handleVote } from "@/lib/firebase/votes";
import BookDisplay from "@/components/books/single-book-display/book-display";
import BookReviews from "@/components/books/single-book-display/book-reviews";
import { useBook } from "@/hooks/useBook";
import { useReviews } from "@/hooks/useReviews";

export default function BookPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { data?: string };
}) {
  const { user } = useAuth();
  const { book, loading, error, setBook } = useBook(params.id, searchParams.data);
  
  const {
    reviews,
    isWritingReview,
    reviewContent,
    reviewVotes,
    hasMoreReviews,
    loadingReviews,
    setReviewContent,
    toggleWritingReview,
    handleSubmitReview,
    handleReviewVote,
    handleDeleteReview,
    loadMoreReviews
  } = useReviews(params.id);

  const handleBookVote = async (voteType: "upvote" | "downvote") => {
    if (!book || !user) return;
    try {
      const result = await handleVote("book", book.id, user.uid, voteType);
      setBook(prevBook => {
        if (!prevBook) return null;
        return {
          ...prevBook,
          volumeInfo: {
            ...prevBook.volumeInfo,
            upvotes: result.upvotes,
            downvotes: result.downvotes,
          },
        };
      });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 pt-24">
        <div className="text-center py-8">Loading book details...</div>
      </div>
    );
  }

  if (error || !book || !book.volumeInfo) {
    return (
      <div className="container mx-auto p-4 pt-24">
        <div className="text-center py-8">{error || "Book not found"}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-24">
      <BookDisplay
        book={book}
        user={user}
        isWritingReview={isWritingReview}
        reviewContent={reviewContent}
        onVote={handleBookVote}
        onReviewToggle={toggleWritingReview}
        onReviewChange={(e) => setReviewContent(e.target.value)}
        onReviewSubmit={() => user && handleSubmitReview(user.uid, user.displayName || "Anonymous")}
      />

      <BookReviews
        reviews={reviews}
        user={user}
        reviewVotes={reviewVotes}
        hasMoreReviews={hasMoreReviews}
        loadingReviews={loadingReviews}
        onReviewVote={(reviewId, voteType) => user && handleReviewVote(reviewId, user.uid, voteType)}
        onDeleteReview={handleDeleteReview}
        onLoadMore={loadMoreReviews}
      />
    </div>
  );
}
