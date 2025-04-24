const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function searchBooks(query: string, maxResults: number = 12) {
  try {
    const response = await fetch(
      `${API_URL}/api/books?q=${encodeURIComponent(query)}&maxResults=${maxResults}`
    );
    if (!response.ok) throw new Error('Failed to fetch books');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
}

export async function getBookById(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/books?id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch book');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
} 