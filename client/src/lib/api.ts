const GOOGLE_BOOKS_API_KEY = 'AIzaSyDXh187zRRhq_Af8HZcAk5SjU_fBKKR5Zo';

export async function searchBooks(query: string, maxResults: number = 12) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch books');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
} 