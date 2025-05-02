import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  arrayRemove as firestoreArrayRemove,
  arrayUnion as firestoreArrayUnion
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import HomeLayout from '@/components/layouts/HomeLayout';
import { useAuthStore } from '@/store/authStore';

import { Star, ThumbsUp, ThumbsDown, Calendar, Share2, MessageSquare, Bookmark, Award, Tag, Plus } from 'lucide-react';
import { BookOpen as LucideBookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { getBookById } from '@/lib/api';
import AddBookToList from '@/components/AddBookToList';

interface BookVolumeInfo {
  title: string;
  authors: string[];
  description: string;
  imageLinks: {
    thumbnail: string;
  };
  publishedDate: string;
  genre_tags?: string[];
}

interface Book {
  id: string;
  volumeInfo: BookVolumeInfo & {
    upvotes?: never;
    downvotes?: never;
  };
  upvotes: string[];
  downvotes: string[];
}

interface Review {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  upvotes: string[];
  downvotes: string[];
  bookId: string;
}

const REVIEWS_PER_PAGE = 5;

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [showAddToList, setShowAddToList] = useState(false);


  // Fetch book details
  useEffect(() => {
    async function fetchBook() {
      if (!id) return;

      try {
        setLoading(true);
        // Try to use passed data from search params first
        const bookData = searchParams.get('data');
        if (bookData) {
          const parsedBook = JSON.parse(decodeURIComponent(bookData));

          
          // Check Firestore for existing document
          const bookRef = doc(db, 'books', id);
          const bookDoc = await getDoc(bookRef);
          
          if (!bookDoc.exists()) {
            // Create book document if it doesn't exist
            await setDoc(bookRef, {
              upvotes: [],
              downvotes: [],
              volumeInfo: parsedBook.volumeInfo
            });
          }

          const firestoreData = bookDoc.exists() ? bookDoc.data() : { upvotes: [], downvotes: [] };

          // Merge API data with Firestore data
          setBook({
            ...parsedBook,
            upvotes: firestoreData.upvotes || [],
            downvotes: firestoreData.downvotes || []

          });
          return;
        }

        // Otherwise fetch from API and Firestore
        const apiData = await getBookById(id);

        // Check Firestore for votes
        const bookRef = doc(db, 'books', id);
        const bookDoc = await getDoc(bookRef);

        
        if (!bookDoc.exists()) {
          // Create book document if it doesn't exist
          await setDoc(bookRef, {
            upvotes: [],
            downvotes: [],
            volumeInfo: apiData.volumeInfo
          });
        }

        const firestoreData = bookDoc.exists() ? bookDoc.data() : { upvotes: [], downvotes: [] };

        // Merge API data with Firestore data
        setBook({
          ...apiData,
          upvotes: firestoreData.upvotes || [],
          downvotes: firestoreData.downvotes || []
        });
      } catch (error) {
        console.error('Error fetching book:', error);
        setError('Failed to load book');

      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id, searchParams]);

  // Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      if (!id) return;

      try {
        setLoadingReviews(true);
        const reviewsRef = collection(db, 'reviews');
        const reviewsQuery = query(
          reviewsRef,
          where('bookId', '==', id),
          orderBy('createdAt', 'desc'),
          limit(REVIEWS_PER_PAGE)
        );

        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviewsList = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];

        setReviews(reviewsList);
        setHasMoreReviews(reviewsList.length === REVIEWS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    }

    fetchReviews();
  }, [id]);

  const handleBookVote = async (voteType: 'upvote' | 'downvote') => {
    if (!book || !user) return;

    try {
      const bookRef = doc(db, 'books', book.id);

      const userId = user.uid;

      // Get the current document
      const bookDoc = await getDoc(bookRef);
      
      // Initialize arrays if they don't exist
      const currentData = bookDoc.exists() ? bookDoc.data() : {};
      const upvotes = Array.isArray(currentData.upvotes) ? currentData.upvotes : [];
      const downvotes = Array.isArray(currentData.downvotes) ? currentData.downvotes : [];

      // Calculate new vote state

      let newUpvotes = [...upvotes];
      let newDownvotes = [...downvotes];

      if (voteType === 'upvote') {
        if (upvotes.includes(userId)) {
          newUpvotes = upvotes.filter(id => id !== userId);
        } else {
          newUpvotes.push(userId);
          newDownvotes = downvotes.filter(id => id !== userId);
        }
      } else {
        if (downvotes.includes(userId)) {
          newDownvotes = downvotes.filter(id => id !== userId);
        } else {
          newDownvotes.push(userId);
          newUpvotes = upvotes.filter(id => id !== userId);
        }
      }


      // Update Firestore with all necessary fields
      await setDoc(bookRef, {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        volumeInfo: book.volumeInfo,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      // Update local state only after successful Firestore update

      setBook(prev => prev ? {
        ...prev,
        upvotes: newUpvotes,
        downvotes: newDownvotes
      } : null);
    } catch (error) {
      console.error('Error voting:', error);

      // Optionally show error to user

    }
  };

  const handleReviewVote = async (reviewId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) return;

    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      const reviewDoc = await getDoc(reviewRef);
      
      if (!reviewDoc.exists()) return;

      const review = reviewDoc.data() as Review;
      const userId = user.uid;

      if (voteType === 'upvote') {
        if (review.upvotes.includes(userId)) {
          await updateDoc(reviewRef, {
            upvotes: firestoreArrayRemove(userId)
          });
        } else {
          await updateDoc(reviewRef, {
            upvotes: firestoreArrayUnion(userId),
            downvotes: firestoreArrayRemove(userId)
          });
        }
      } else {
        if (review.downvotes.includes(userId)) {
          await updateDoc(reviewRef, {
            downvotes: firestoreArrayRemove(userId)
          });
        } else {
          await updateDoc(reviewRef, {
            downvotes: firestoreArrayUnion(userId),
            upvotes: firestoreArrayRemove(userId)
          });
        }
      }

      // Refresh reviews
      const updatedReviewDoc = await getDoc(reviewRef);
      setReviews(prev => 
        prev.map(r => 
          r.id === reviewId 
            ? { ...r, ...updatedReviewDoc.data() } as Review
            : r
        )
      );
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !book || !reviewContent.trim() || submittingReview) return;

    try {
      setSubmittingReview(true);
      const reviewRef = doc(collection(db, 'reviews'));
      const newReview: Review = {
        id: reviewRef.id,
        bookId: book.id,
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        content: reviewContent.trim(),
        createdAt: new Date().toISOString(),
        upvotes: [],
        downvotes: []
      };


      // Save review to Firestore
      await setDoc(reviewRef, newReview);

      // Update local state

      setReviews(prev => [newReview, ...prev]);
      setReviewContent('');
      setIsWritingReview(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleLoadMoreReviews = async () => {
    if (!id || loadingReviews) return;

    try {
      setLoadingReviews(true);
      const lastReview = reviews[reviews.length - 1];
      const reviewsRef = collection(db, 'reviews');
      const reviewsQuery = query(
        reviewsRef,
        where('bookId', '==', id),
        orderBy('createdAt', 'desc'),
        startAfter(lastReview.createdAt),
        limit(REVIEWS_PER_PAGE)
      );

      const reviewsSnapshot = await getDocs(reviewsQuery);
      const newReviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];

      setReviews(prev => [...prev, ...newReviews]);
      setHasMoreReviews(newReviews.length === REVIEWS_PER_PAGE);
    } catch (error) {
      console.error('Error loading more reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (loading) {
    return (
      <HomeLayout>

        <div className="h-full bg-gradient-to-b from-background to-accent/50 animate-pulse">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="w-[280px] h-[420px] bg-muted rounded-2xl" />
              <div className="flex-1 space-y-8">
                <div className="h-12 bg-muted rounded-lg w-3/4" />
                <div className="h-6 bg-muted rounded-lg w-1/2" />
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-4 bg-muted rounded w-4/6" />

                </div>
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
    );
  }

  if (error || !book) {
    return (
      <HomeLayout>

        <div className="h-full bg-gradient-to-b from-background to-accent/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {error || 'Book not found'}
              </h2>
              <p className="text-muted-foreground">

                We couldn't find the book you're looking for.
              </p>
            </div>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>

      {/* Background with gradient */}
      <div className="relative bg-gradient-to-b from-background to-accent/50 dark:from-background dark:to-accent/10">
        {/* Blur Effect Background */}
        <div className="fixed inset-0 -z-10">
          <img
            src={book.volumeInfo.imageLinks?.thumbnail}
            alt={book.volumeInfo.title}
            className="w-full h-full object-cover blur-2xl opacity-10 scale-110"
          />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Book Info Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-12 items-start"
          >
            {/* Book Cover Section */}
            <div className="relative flex-shrink-0 w-[280px] mx-auto lg:mx-0">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail}
                  alt={book.volumeInfo.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Rating Badge */}
              <div className="absolute -top-3 -right-3 bg-card rounded-full p-3 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-foreground">4.5</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute -left-3 top-1/4 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-card rounded-full shadow-lg hover:text-accent-foreground/90 border border-border"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className={`w-5 h-5 text-indigo-600 dark:text-indigo-400 ${isBookmarked ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-card rounded-full shadow-lg hover:text-accent-foreground/90 border border-border"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </motion.button>
              </div>
            </div>

            {/* Book Info Section */}
            <div className="flex-1 space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground font-dmSans mb-4">
                  {book.volumeInfo.title}
                </h1>
                <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">
                  by {book.volumeInfo.authors?.join(", ")}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-3 text-foreground">
                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Published</p>
                      <p className="font-semibold">{new Date(book.volumeInfo.publishedDate).getFullYear()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-3 text-foreground">
                    <LucideBookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Read Time</p>
                      <p className="font-semibold">5h 23m</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-3 text-foreground">
                    <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Reviews</p>
                      <p className="font-semibold">{reviews.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-3 text-foreground">
                    <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-semibold">4.5/5</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">About this book</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {book.volumeInfo.description}
                </p>
                
                {/* Genre Tags */}
                {book.volumeInfo.genre_tags && book.volumeInfo.genre_tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {book.volumeInfo.genre_tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                        >
                          <Tag className="w-4 h-4" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBookVote('upvote')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    book.upvotes?.includes(user?.uid || '')
                      ? "bg-green-600 text-white"
                      : "bg-card text-foreground hover:bg-accent/10 border border-border"
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${book.upvotes?.includes(user?.uid || '') ? "fill-white" : ""}`} />
                  <span>{book.upvotes?.length || 0}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBookVote('downvote')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    book.downvotes?.includes(user?.uid || '')
                      ? "bg-red-600 text-white"
                      : "bg-card text-foreground hover:bg-accent/10 border border-border"
                  }`}
                >
                  <ThumbsDown className={`w-5 h-5 ${book.downvotes?.includes(user?.uid || '') ? "fill-white" : ""}`} />
                  <span>{book.downvotes?.length || 0}</span>
                </motion.button>
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddToList(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-400 dark:hover:bg-indigo-500 text-white transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add to List</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Reviews Section */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWritingReview(true)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-400 dark:hover:bg-indigo-500 text-white rounded-full transition-colors duration-300"
              >
                Write a Review
              </motion.button>
            </div>

            {/* Review Form */}
            {isWritingReview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl p-6 shadow-sm mb-8"
              >
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  className="w-full h-32 p-4 bg-background text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                />
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setIsWritingReview(false)}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitReview}
                    disabled={submittingReview || !reviewContent.trim()}
                    className="px-6 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors duration-300 disabled:opacity-50"
                  >
                    {submittingReview ? 'Posting...' : 'Post Review'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{review.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {user?.uid === review.userId && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{review.content}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleReviewVote(review.id, 'upvote')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                          review.upvotes.includes(user?.uid || '')
                            ? "bg-accent text-accent-foreground"
                            : "bg-card text-foreground hover:bg-accent/10"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.upvotes.length}</span>
                      </button>
                      <button
                        onClick={() => handleReviewVote(review.id, 'downvote')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                          review.downvotes.includes(user?.uid || '')
                            ? "bg-red-600 text-white"
                            : "bg-card text-foreground hover:bg-accent/10"
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{review.downvotes.length}</span>
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {hasMoreReviews && (
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadMoreReviews}
                  disabled={loadingReviews}
                  className="px-6 py-2.5 bg-card text-accent border border-accent rounded-full hover:bg-accent/10 transition-colors duration-300"
                >
                  {loadingReviews ? 'Loading...' : 'Load More Reviews'}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddToList && book && (
        <AddBookToList
          bookId={book.id}
          onClose={() => setShowAddToList(false)}
        />
      )}
    </HomeLayout>
  );
} 