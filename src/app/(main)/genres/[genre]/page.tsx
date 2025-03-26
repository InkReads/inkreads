import BookDisplay from "@/components/books/multiple-book-display/book-display";
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      </div>
      <BookDisplay 
        defaultQuery={query}
      />
    </div>
  );
}

// Type guard for genre validation
function isValidGenre(genre: string): genre is GenreSlug {
  return genre in GENRES;
} 