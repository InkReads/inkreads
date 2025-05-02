import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GENRES, type GenreSlug } from '@/components/constants';
import HomeLayout from '@/components/layouts/HomeLayout';
import BookCard from '@/components/books/BookCard';
import { Loader2, RefreshCcw, Sparkles, Library, Users } from 'lucide-react';
import { searchBooks } from '@/lib/api';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    publishedDate?: string;
    genre_tags?: string[];
  };
}

interface CachedGenreData {
  books: Book[];
  lastUpdated: {
    seconds: number;
    nanoseconds: number;
  } | Date;
  genre: string;
}

export default function GenrePage() {
  const { genre } = useParams<{ genre: GenreSlug }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const genreInfo = genre ? GENRES[genre as GenreSlug] : null;

  // Function to fetch cached books from Firestore
  const fetchCachedBooks = async () => {
    if (!genre) return [];
    
    try {
      const cachedData = await getDocs(query(collection(db, 'genre_cache'), where('genre', '==', genre)));
      
      if (!cachedData.empty) {
        const data = cachedData.docs[0].data() as CachedGenreData;
        // Convert Firestore Timestamp to Date and check if cache is less than 24 hours old
        const lastUpdated = data.lastUpdated instanceof Date ? data.lastUpdated : new Date(data.lastUpdated.seconds * 1000);
        const cacheAge = new Date().getTime() - lastUpdated.getTime();
        if (cacheAge < 24 * 60 * 60 * 1000) {
          return data.books;
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching cached books:', error);
      return [];
    }
  };

  // Function to update cache with new books
  const updateCache = async (newBooks: Book[]) => {
    if (!genre) return;
    
    try {
      const genreRef = doc(db, 'genre_cache', genre);
      await setDoc(genreRef, {
        books: newBooks,
        lastUpdated: Timestamp.now(),
        genre
      });
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  };

  // Function to fetch fresh books from API
  const fetchFreshBooks = async () => {
    if (!genreInfo) return [];
    
    try {
      setRefreshing(true);
      const freshBooks = await searchBooks(genreInfo.query);
      console.log(`Fresh books from API for genre ${genre}:`, freshBooks.map((book: Book) => ({
        id: book.id,
        title: book.volumeInfo.title,
        volumeInfo_keys: Object.keys(book.volumeInfo),
        genre_tags: book.volumeInfo.genre_tags
      })));
      return freshBooks;
    } catch (error) {
      console.error('Error fetching fresh books:', error);
      return [];
    } finally {
      setRefreshing(false);
    }
  };

  // Function to clear cache for testing
  /*
  const clearCache = async () => {
    if (!genre) return;
    try {
      const cacheRef = collection(db, 'genre_cache');
      const q = query(cacheRef, where('genre', '==', genre));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      console.log('Cache cleared for genre:', genre);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };
*/
  // Main fetch function that orchestrates cached and fresh loads
  useEffect(() => {
    async function fetchBooks() {
      if (!genreInfo) return;
      
      try {
        setLoading(true);
        setError(null);

        // First, try to load cached books
        const cachedBooks = await fetchCachedBooks();
        console.log(`Cached books for genre ${genre}:`, cachedBooks.map((book: Book) => ({
          id: book.id,
          title: book.volumeInfo.title,
          volumeInfo_keys: Object.keys(book.volumeInfo),
          genre_tags: book.volumeInfo.genre_tags
        })));
        if (cachedBooks.length > 0) {
          setBooks(cachedBooks);
          setLoading(false);
        }

        // Then fetch fresh books in the background
        const freshBooks = await fetchFreshBooks();
        if (freshBooks.length > 0) {
          // Merge fresh books with cached books, preferring fresh data but keeping cached genre tags
          const mergedBooks = freshBooks.map((freshBook: Book) => {
            const cachedBook = cachedBooks.find(cached => cached.id === freshBook.id);
            const mergedBook = {
              ...freshBook,
              volumeInfo: {
                ...freshBook.volumeInfo,
                genre_tags: cachedBook?.volumeInfo.genre_tags || freshBook.volumeInfo.genre_tags
              }
            };
            console.log('Merged book details:', {
              id: mergedBook.id,
              title: mergedBook.volumeInfo.title,
              volumeInfo_keys: Object.keys(mergedBook.volumeInfo),
              genre_tags: mergedBook.volumeInfo.genre_tags,
              from_cache: !!cachedBook,
              cached_tags: cachedBook?.volumeInfo.genre_tags,
              fresh_tags: freshBook.volumeInfo.genre_tags
            });
            return mergedBook;
          });

          console.log(`Final books for genre ${genre}:`, mergedBooks.map((book: Book) => ({
            id: book.id,
            title: book.volumeInfo.title,
            volumeInfo_keys: Object.keys(book.volumeInfo),
            genre_tags: book.volumeInfo.genre_tags
          })));

          setBooks(mergedBooks);
          // Update cache with merged books
          await updateCache(mergedBooks);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch books');
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [genreInfo]);

  if (!genreInfo) {
    return (
      <HomeLayout>

        <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-white dark:from-background to-indigo-50/50 dark:to-accent/10">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-3xl font-bold text-indigo-900 dark:text-indigo-300 mb-4">Genre not found</h1>
            <p className="text-indigo-600/70 dark:text-indigo-400/70">The genre you're looking for doesn't exist or has been moved.</p>

          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>

      <div className="min-h-screen bg-gradient-to-b from-white dark:from-background to-indigo-50/50 dark:to-accent/10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm mb-6">
              <genreInfo.icon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-300 mb-4">{genreInfo.title}</h1>
            <p className="text-lg text-indigo-600/70 dark:text-indigo-400/70 max-w-2xl mx-auto">

              {genreInfo.description}
            </p>
          </div>

          {/* User-Created Fanfictions Section - Only show for fanfiction genre */}
          {genre === 'fanfiction' && (
            <div className="mb-12">
              <div
                onClick={() => navigate('/fanfiction/user')}
                className="group relative overflow-hidden rounded-xl cursor-pointer bg-white/50 backdrop-blur-sm border border-indigo-100/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90 opacity-90 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative p-6 flex flex-col items-center justify-center min-h-[140px] text-center">
                  <Users className="w-10 h-10 text-white mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold text-white mb-2">Community Creations</h3>
                  <p className="text-base text-white/80 max-w-2xl">
                    Discover unique stories created by fellow InkReads users. From alternate endings to original characters, explore the creativity of our community.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading States */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">

              <Loader2 className="h-10 w-10 animate-spin text-indigo-500 dark:text-indigo-400" />
              <p className="mt-4 text-lg text-indigo-600/70 dark:text-indigo-400/70">Loading books...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-12 shadow-xl max-w-md mx-auto border border-indigo-50 dark:border-indigo-500/20 ring-1 ring-indigo-100 dark:ring-indigo-500/10">
                <div className="relative mb-6">
                  <Library className="h-20 w-20 mx-auto text-indigo-300 dark:text-indigo-400" />
                  <Sparkles className="h-6 w-6 text-indigo-400 dark:text-indigo-300 absolute top-0 right-1/3 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300 mb-3">
                  No books found
                </h3>
                <p className="text-indigo-600/70 dark:text-indigo-400/70 text-lg">

                  We couldn't find any books in this genre. Try checking back later.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Refresh Indicator */}
              {refreshing && (

                <div className="flex items-center justify-center gap-2 mb-6 text-indigo-600/70 dark:text-indigo-400/70">

                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Refreshing results...</span>
                </div>
              )}
              
              {/* Books Grid */}
              <div className="grid gap-8 relative">
                {books.map((book, index) => (
                  <div
                    key={book.id}
                    className="transform hover:-translate-y-1 transition-all duration-200"
                    style={{
                      opacity: 0,
                      animation: `fadeSlideIn 0.5s ease-out ${index * 0.1}s forwards`
                    }}
                  >
                    <BookCard
                      id={book.id}
                      title={book.volumeInfo.title}
                      authors={book.volumeInfo.authors || []}
                      thumbnail={book.volumeInfo.imageLinks?.thumbnail || '/placeholder-book.png'}
                      description={book.volumeInfo.description}
                      publishedDate={book.volumeInfo.publishedDate}
                      reverse={index % 2 === 1}
                      genre_tags={book.volumeInfo.genre_tags}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Decorative Elements */}

        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-500/30 dark:from-indigo-400/20 to-purple-500/30 dark:to-purple-400/20 blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-500/30 dark:from-purple-400/20 to-pink-500/30 dark:to-pink-400/20 blur-3xl opacity-20 animate-pulse delay-1000" />


      </div>
    </HomeLayout>
  );
} 