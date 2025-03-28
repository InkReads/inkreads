import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HomeLayout from '../../layouts/home-layout';
import { ArrowUpIcon, ArrowDownIcon, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { handleVote, getUserVotes, getVotes } from '@/lib/firebase/votes';
import { Textarea } from "@/components/ui/textarea";
import { addReview, getBookReviews, deleteReview, type Review } from '@/lib/firebase/reviews';

interface Book {
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

// Helper function to clean HTML from text
const cleanDescription = (html: string): string => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    let text = temp.textContent || temp.innerText || '';
    text = text.replace(/\s+/g, ' ');
    return text;
};

export default function BookPage() {
    const router = useRouter();
    const { id, data } = router.query;
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewVotes, setReviewVotes] = useState<Record<string, 'upvote' | 'downvote' | null>>({});
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [reviewContent, setReviewContent] = useState('');
    const [hasMoreReviews, setHasMoreReviews] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const handleBookVote = async (voteType: 'upvote' | 'downvote') => {
        if (!book || !user) return;

        try {
            const result = await handleVote('book', book.id, user.uid, voteType);
            
            // Update the UI with the new vote counts
            setBook(prevBook => {
                if (!prevBook) return null;
                return {
                    ...prevBook,
                    volumeInfo: {
                        ...prevBook.volumeInfo,
                        upvotes: result.upvotes,
                        downvotes: result.downvotes
                    }
                };
            });

            // Update the user's vote state
            setUserVote(
                voteType === userVote ? null : voteType
            );
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const handleReviewVote = async (reviewId: string, voteType: 'upvote' | 'downvote') => {
        if (!user) return;

        try {
            const result = await handleVote('review', reviewId, user.uid, voteType);
            
            // Update the UI with the new vote counts
            setReviews(prevReviews => {
                return prevReviews.map(review => {
                    if (review.id !== reviewId) return review;
                    return {
                        ...review,
                        upvotes: result.upvotes,
                        downvotes: result.downvotes
                    };
                });
            });

            // Update the user's vote state for this review
            setReviewVotes(prev => ({
                ...prev,
                [reviewId]: voteType === prev[reviewId] ? null : voteType
            }));
        } catch (error) {
            console.error('Error voting on review:', error);
        }
    };

    const handleSubmitReview = async () => {
        if (!user || !book || !reviewContent.trim()) return;

        try {
            const newReview = {
                userId: user.uid,
                username: user.displayName || 'Anonymous',
                content: reviewContent.trim(),
                date: new Date().toISOString(), // Store as ISO string for proper ordering
                bookId: book.id,
                upvotes: 0,
                downvotes: 0
            };

            const savedReview = await addReview(newReview);
            setReviews(prev => [savedReview, ...prev]);
            setReviewContent('');
            setIsWritingReview(false);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const loadMoreReviews = async () => {
        if (!book || loadingReviews) return;

        try {
            setLoadingReviews(true);
            const lastReview = reviews[reviews.length - 1];
            const { reviews: newReviews, hasMore } = await getBookReviews(book.id, lastReview);
            
            setReviews(prev => [...prev, ...newReviews]);
            setHasMoreReviews(hasMore);
        } catch (error) {
            console.error('Error loading more reviews:', error);
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!user) return;
        
        try {
            await deleteReview(reviewId);
            setReviews(prev => prev.filter(review => review.id !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    useEffect(() => {
        const fetchBookAndReviews = async () => {
            if (!id) return;

            try {
                let bookData;
                if (data) {
                    bookData = JSON.parse(decodeURIComponent(data as string));
                } else {
                    const response = await fetch(`/api/getBook?id=${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch book');
                    }
                    bookData = await response.json();
                }

                // Get vote counts for the book
                const bookVoteData = await getVotes('book', bookData.id);
                
                // Initialize votes if not present
                const bookWithVotes = {
                    ...bookData,
                    volumeInfo: {
                        ...bookData.volumeInfo,
                        upvotes: bookVoteData.upvoters.length,
                        downvotes: bookVoteData.downvoters.length
                    }
                };
                setBook(bookWithVotes);

                // Fetch initial reviews
                const { reviews: initialReviews, hasMore } = await getBookReviews(bookData.id);
                setReviews(initialReviews);
                setHasMoreReviews(hasMore);

                // Fetch user's existing votes if logged in
                if (user) {
                    // Get book vote
                    const bookVotes = await getUserVotes('book', [bookData.id], user.uid);
                    setUserVote(bookVotes[bookData.id]);

                    // Get review votes
                    const reviewIds = initialReviews.map(review => review.id);
                    const reviewVotesData = await getUserVotes('review', reviewIds, user.uid);
                    setReviewVotes(reviewVotesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchBookAndReviews();
    }, [id, data, user]);

    if (loading) {
        return (
            <HomeLayout>
                <div className="container mx-auto p-4 pt-24">
                    <div className="text-center py-8">Loading book details...</div>
                </div>
            </HomeLayout>
        );
    }

    if (error || !book || !book.volumeInfo) {
        return (
            <HomeLayout>
                <div className="container mx-auto p-4 pt-24">
                    <div className="text-center py-8">{error || 'Book not found'}</div>
                </div>
            </HomeLayout>
        );
    }

    return (
        <HomeLayout>
            <div className="container mx-auto p-4 pt-24">
                <div className="flex gap-8">
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                        <img 
                            src={book.volumeInfo.imageLinks?.thumbnail || '/placeholder-book.jpg'} 
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
                            by {book.volumeInfo.authors?.join(', ')}
                        </p>
                        <div className="prose max-w-none mb-6">
                            <p className="text-gray-700">{cleanDescription(book.volumeInfo.description) || 'No description available.'}</p>
                        </div>

                        {/* Voting System and Review Button */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                {/* Upvote */}
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleBookVote('upvote')}
                                        disabled={!user}
                                        className={`p-1 rounded-full transition-colors ${
                                            user ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed opacity-50'
                                        }`}
                                        title={user ? undefined : 'Please login to vote'}
                                    >
                                        <ArrowUpIcon className="w-6 h-6 text-gray-600" />
                                    </button>
                                    <span className="text-lg font-medium">{book.volumeInfo.upvotes}</span>
                                </div>

                                {/* Downvote */}
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleBookVote('downvote')}
                                        disabled={!user}
                                        className={`p-1 rounded-full transition-colors ${
                                            user ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed opacity-50'
                                        }`}
                                        title={user ? undefined : 'Please login to vote'}
                                    >
                                        <ArrowDownIcon className="w-6 h-6 text-gray-600" />
                                    </button>
                                    <span className="text-lg font-medium">{book.volumeInfo.downvotes}</span>
                                </div>
                            </div>

                            {user && (
                                <Button 
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => setIsWritingReview(!isWritingReview)}
                                >
                                    {isWritingReview ? 'Cancel Review' : 'Write a Review'}
                                </Button>
                            )}
                        </div>

                        {/* Review Writing Section */}
                        {isWritingReview && (
                            <div className="mt-6 space-y-4">
                                <Textarea
                                    placeholder="Write your review here..."
                                    value={reviewContent}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewContent(e.target.value)}
                                    className="min-h-[150px] p-4"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSubmitReview}
                                        disabled={!reviewContent.trim()}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Submit Review
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-6">
                                        <span className="text-gray-500">
                                            by {review.username} • {new Date(review.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        {/* Review Voting System */}
                                        <div className="flex items-center gap-6">
                                            {/* Review Upvote */}
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleReviewVote(review.id, 'upvote')}
                                                    disabled={!user}
                                                    className={`p-1 rounded-full transition-colors ${
                                                        user ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed opacity-50'
                                                    } ${reviewVotes[review.id] === 'upvote' ? 'text-blue-500' : 'text-gray-600'}`}
                                                    title={user ? undefined : 'Please login to vote'}
                                                >
                                                    <ArrowUpIcon className="w-6 h-6" />
                                                </button>
                                                <span className="text-lg font-medium">{review.upvotes}</span>
                                            </div>

                                            {/* Review Downvote */}
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleReviewVote(review.id, 'downvote')}
                                                    disabled={!user}
                                                    className={`p-1 rounded-full transition-colors ${
                                                        user ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed opacity-50'
                                                    } ${reviewVotes[review.id] === 'downvote' ? 'text-red-500' : 'text-gray-600'}`}
                                                    title={user ? undefined : 'Please login to vote'}
                                                >
                                                    <ArrowDownIcon className="w-6 h-6" />
                                                </button>
                                                <span className="text-lg font-medium">{review.downvotes}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {user && user.uid === review.userId && (
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
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
                                    onClick={loadMoreReviews}
                                    disabled={loadingReviews}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {loadingReviews ? 'Loading...' : 'Show More Reviews'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
} 