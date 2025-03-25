// This component is used to search for books using the Google Books API.
// It takes an optional defaultQuery prop that can be used to set the initial search query.
// The searchBooks function is used to fetch books based on the search query.
// The useEffect hook is used to call the searchBooks function when the defaultQuery prop is set.
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Book {
    id: string;
    volumeInfo: {
        title: string;
        authors: string[];
        publishedDate: string;
        description: string;
        imageLinks: {
            thumbnail: string;
        };
    };
}

interface BookSearchProps {
    defaultQuery?: string;
}

// This is the BookSearch component that fetches books based on a search query.
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
            setBooks(data.items || []);
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
        <div>
            {!defaultQuery && (
                <div>
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        placeholder="Search for books..."
                    />
                    <button onClick={() => searchBooks(query)} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            )}
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <h2>{book.volumeInfo.title}</h2>
                        <p>{book.volumeInfo.authors?.join(', ')}</p>
                        <Image 
                            src={book.volumeInfo.imageLinks?.thumbnail || '/placeholder.png'}
                            alt={book.volumeInfo.title}
                            width={128}
                            height={192}
                            className="w-32 h-48 object-cover"
                        />
                        <p>{book.volumeInfo.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}