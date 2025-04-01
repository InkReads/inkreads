export const GENRES = {
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
export type GenreSlug = keyof typeof GENRES; 