import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GENRES, type GenreSlug } from '@/components/constants';
import HomeLayout from '@/components/layouts/HomeLayout';
import BookCard from '@/components/books/BookCard';
import { Loader2, BookOpen, RefreshCcw, Sparkles, Library } from 'lucide-react';
import { searchBooks } from '@/lib/api';

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
  };
}

export default function GenrePage() {
  const { genre } = useParams<{ genre: GenreSlug }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const genreInfo = genre ? GENRES[genre as GenreSlug] : null;

  useEffect(() => {
    async function fetchBooks() {
      if (!genreInfo) return;
      
      try {
        setLoading(true);
        setError(null);
        const query = genreInfo.query;
        const books = await searchBooks(query);
        setBooks(books);
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
        <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-white to-indigo-50/50">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-3xl font-bold text-indigo-900 mb-4">Genre not found</h1>
            <p className="text-indigo-600/70">The genre you're looking for doesn't exist or has been moved.</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 2rem 2rem, 2rem 2rem'
          }}
        />

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Genre Header */}
            <div className="relative py-8 sm:py-12">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
              </div>
              
              <div className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-2 bg-white/30 backdrop-blur-sm rounded-2xl mb-4 shadow-xl ring-1 ring-indigo-100">
                    <genreInfo.icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-3 animate-gradient-x">
                    {genreInfo.title}
                  </h1>
                  
                  <p className="text-lg text-indigo-600/70 max-w-2xl mx-auto leading-relaxed">
                    {genreInfo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="relative pt-4 pb-20">
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 animate-spin text-indigo-500" />
                    <div className="absolute inset-0 animate-ping opacity-50">
                      <Loader2 className="h-16 w-16 text-indigo-300" />
                    </div>
                  </div>
                  <p className="mt-6 text-xl text-indigo-600/70">Discovering amazing books...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16 px-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-auto border border-red-100 ring-1 ring-red-50">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="inline-flex items-center gap-2 px-6 py-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                      <RefreshCcw className="h-5 w-5" />
                      <span>Try again</span>
                    </button>
                  </div>
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl max-w-md mx-auto border border-indigo-50 ring-1 ring-indigo-100">
                    <div className="relative mb-6">
                      <Library className="h-20 w-20 mx-auto text-indigo-300" />
                      <Sparkles className="h-6 w-6 text-indigo-400 absolute top-0 right-1/3 animate-bounce" />
                    </div>
                    <h3 className="text-2xl font-bold text-indigo-900 mb-3">
                      No books found
                    </h3>
                    <p className="text-indigo-600/70 text-lg">
                      We couldn't find any books in this genre. Try checking back later.
                    </p>
                  </div>
                </div>
              ) : (
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
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-500/30 to-pink-500/30 blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>
    </HomeLayout>
  );
} 