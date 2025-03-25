// This component is used to search for books using the Google Books API.
// It takes an optional defaultQuery prop that can be used to set the initial search query.
// The searchBooks function is used to fetch books based on the search query.
// The useEffect hook is used to call the searchBooks function when the defaultQuery prop is set.
import { useState, useEffect } from 'react';
import BookCard from './book-card';
import { getVotes } from '@/lib/firebase/votes';

interface Book {
    id: string;
    volumeInfo: {
        title: string;
        authors: string[];
        imageLinks: {
            thumbnail: string;
        };
        upvotes?: number;
        description?: string;
        publishedDate?: string;
    };
}

interface BookSearchProps {
    defaultQuery?: string;
}

export default function BookSearch({ defaultQuery = '' }: BookSearchProps) {
    const [query, setQuery] = useState<string>(defaultQuery);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const searchBooks = async (searchQuery: string) => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/searchBooks?query=${searchQuery}`);
            const data = await response.json();
            
            // Fetch vote counts for each book
            const booksWithVotes = await Promise.all((data.items || []).map(async (book: Book) => {
                const voteData = await getVotes('book', book.id);
                return {
                    ...book,
                    volumeInfo: {
                        ...book.volumeInfo,
                        upvotes: voteData.upvoters.length
                    }
                };
            }));
            
            setBooks(booksWithVotes);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (defaultQuery) {
            searchBooks(defaultQuery);
        }
    }, [defaultQuery]);

    return (
        <div className="space-y-6">
            {!defaultQuery && (
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        placeholder="Search for books..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        onClick={() => searchBooks(query)} 
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            )}
            
            {loading ? (
                <div className="text-center py-8">Loading books...</div>
            ) : (
                <div className="space-y-4">
                    {books.map((book) => (
                        <BookCard
                            key={book.id}
                            id={book.id}
                            title={book.volumeInfo.title}
                            authors={book.volumeInfo.authors || []}
                            thumbnail={book.volumeInfo.imageLinks?.thumbnail || '/placeholder-book.jpg'}
                            upvotes={book.volumeInfo.upvotes}
                            description={book.volumeInfo.description}
                            publishedDate={book.volumeInfo.publishedDate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}