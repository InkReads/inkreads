"use client";

import Link from "next/link";
import { GENRES } from "./constants";

export default function GenresPage() {
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Browse by Genre</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {Object.entries(GENRES).map(([slug, { title, description }]) => (
          <Link
            key={slug}
            href={`/genres/${slug}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 