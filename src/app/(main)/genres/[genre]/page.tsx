import BookSearch from "@/components/book-search/book-search";
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

export default function GenrePage({ params }: { params: { genre: string } }) {
  // Type check and validate the genre parameter
  if (!isValidGenre(params.genre)) {
    notFound();
  }

  const genre = params.genre as GenreSlug;
  const { title, query, description } = GENRES[genre];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <BookSearch defaultQuery={query} />
    </div>
  );
}

// Type guard for genre validation
function isValidGenre(genre: string): genre is GenreSlug {
  return genre in GENRES;
} 