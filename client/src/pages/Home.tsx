import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import HomeNavbar from '@/components/HomeNavbar';
import HomeLayout from '@/components/layouts/HomeLayout';
import BookCard from '@/components/books/BookCard';
import { GENRES } from '@/components/constants';
import { searchBooks } from '@/lib/api';
import { Loader2, BookOpen } from 'lucide-react';

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

export default function Home() {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        setLoading(true);
        const books = await searchBooks('best sellers 2024', 6);
        setFeaturedBooks(books);
      } catch (error) {
        console.error('Error fetching featured books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <HomeLayout>
      <HomeNavbar />

      <main className="min-h-screen bg-white dark:bg-background relative">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf680,#6366f180)] opacity-[0.07] dark:opacity-[0.03]" />

        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(circle at center, white 30%, transparent 80%)',
          }}
        />

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            {/* Hero Section */}
            <div className="relative py-12">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
              </div>
              <div className="text-center relative z-10">

                <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-300 sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Discover Your Next Adventure
                </h1>
                <p className="mt-4 text-xl text-indigo-600/70 dark:text-indigo-400/70 max-w-2xl mx-auto">

                  Explore curated collections of books across various genres, from thrilling mysteries to heartwarming romances.
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Genres Grid */}
            <section className="py-12">

              <h2 className="text-3xl font-bold text-indigo-900 dark:text-indigo-300 mb-8">Popular Genres</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(GENRES).map(([slug, genre]) => (
                  <div
                    key={slug}
                    onClick={() => navigate(`/genres/${slug}`)}

                    className="group relative overflow-hidden rounded-xl cursor-pointer bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-indigo-100/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/70 to-purple-600/70 opacity-90 group-hover:opacity-100 transition-all duration-300" />

                    <div className="relative p-6 flex flex-col items-center justify-center min-h-[160px] text-center">
                      <genre.icon className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-lg font-semibold text-white mb-1">{genre.title}</h3>
                      <p className="text-sm text-white/80 line-clamp-2">{genre.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Books */}
            <section className="py-12">

              <h2 className="text-3xl font-bold text-indigo-900 dark:text-indigo-300 mb-8">Featured Books</h2>
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-500 dark:text-indigo-400" />
                  <p className="mt-4 text-lg text-indigo-600/70 dark:text-indigo-400/70">Loading featured books...</p>
                </div>
              ) : featuredBooks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-sm max-w-md mx-auto border border-indigo-50 dark:border-indigo-500/20">
                    <BookOpen className="h-12 w-12 mx-auto text-indigo-300 dark:text-indigo-400 mb-4" />
                    <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                      No books found
                    </h3>
                    <p className="text-indigo-600/70 dark:text-indigo-400/70">

                      We couldn't find any featured books at the moment. Please try again later.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredBooks.map((book) => (
                    <div key={book.id} className="transform hover:-translate-y-1 transition-all duration-200">
                      <BookCard
                        id={book.id}
                        title={book.volumeInfo.title}
                        authors={book.volumeInfo.authors || []}
                        thumbnail={book.volumeInfo.imageLinks?.thumbnail || '/placeholder-book.png'}
                        description={book.volumeInfo.description}
                        publishedDate={book.volumeInfo.publishedDate}
                        genre_tags={book.volumeInfo.genre_tags}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </HomeLayout>
  );
}
