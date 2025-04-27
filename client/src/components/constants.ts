import { BookOpenText, BookText, Palette, Sparkles, Search } from 'lucide-react';

export const GENRES = {
  lightnovels: {
    title: "Light Novels",
    query: "light novel",
    description: "Explore Japanese light novels and their translations",
    icon: BookOpenText
  },
  novels: {
    title: "Novels",
    query: "novel",
    description: "Discover traditional novels across all genres",
    icon: BookText
  },
  comics: {
    title: "Comics",
    query: "comic",
    description: "Browse comics, graphic novels, and manga",
    icon: Palette
  },
  mystery: {
    title: "Mystery & Thriller",
    query: "mystery thriller suspense",
    description: "Dive into gripping mysteries and heart-pounding thrillers",
    icon: Search
  },
  fanfiction: {
    title: "Fanfiction",
    query: "fanfiction",
    description: "Read fan-created stories from your favorite universes",
    icon: Sparkles
  },
  manga: {
    title: "Manga",
    query: "manga",
    description: "Explore Japanese manga and their translations",
    icon: Palette
  }
} as const;

// Type for valid genre slugs
export type GenreSlug = keyof typeof GENRES; 