import { BookDisplay } from "@/components/book-display/book-display";
import { notFound } from "next/navigation";

const GENRES = {
  lightnovels: {
    title: "Light Novels",
    query: "light novel",
    description: "Explore Japanese light novels and their translations"
  },
  novels: {
    title: "Novels",
    query: "novel",
    description: "Discover traditional novels across all genres"
  },
  comics: {
    title: "Comics",
    query: "comic",
    description: "Browse comics, graphic novels, and manga"
  },
  fanfiction: {
    title: "Fanfiction",
    query: "fanfiction",
    description: "Read fan-created stories from your favorite universes"
  }
} as const;

// Type for valid genre slugs
type GenreSlug = keyof typeof GENRES;

// Export GENRES for use in other components
export { GENRES };

// Generate static params for all valid genres
export function generateStaticParams() {
  return Object.keys(GENRES).map((genre) => ({
    genre
  }));
}

async function getBooks(query: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );

    if (!response.ok) {
      throw new Error(`Google Books API error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

export default async function GenrePage({ 
  params 
}: { 
  params: Promise<{ genre: string }> 
}) {
  const { genre } = await params;

  if (!isValidGenre(genre)) {
    notFound();
  }

  const { title, query, description } = GENRES[genre];
  const books = await getBooks(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      </div>
      <BookDisplay 
        initialBooks={books} 
        genreLabel={title}
      />
    </div>
  );
}

// Type guard for genre validation
function isValidGenre(genre: string): genre is GenreSlug {
  return genre in GENRES;
} 