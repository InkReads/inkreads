"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface WriteBookReviewProps {
  isWritingReview: boolean;
  reviewContent: string;
  onReviewToggle: () => void;
  onReviewChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onReviewSubmit: () => void;
  isLoggedIn: boolean;
}

export default function WriteBookReview({
  isWritingReview,
  reviewContent,
  onReviewToggle,
  onReviewChange,
  onReviewSubmit,
  isLoggedIn
}: WriteBookReviewProps) {
  return (
    <div className="w-[75%] max-h-8 flex flex-col gap-4">
      <div className="flex justify-end">
        {isLoggedIn && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onReviewToggle}
          >
            {isWritingReview ? "Cancel Review" : "Write a Review"}
          </Button>
        )}
      </div>

      {isWritingReview && (
        <div>
          <Textarea
            placeholder="Write your review here..."
            value={reviewContent}
            onChange={onReviewChange}
            className="w-full min-h-[125px] p-4 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <div className="flex justify-end">
            <Button
              onClick={onReviewSubmit}
              disabled={!reviewContent.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit Review
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
