import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const query = searchParams.get('q');

  if (!id && !query) {
    return NextResponse.json({ error: 'Either id or query parameter is required' }, { status: 400 });
  }

  try {
    let url;
    if (id) {
      url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`;
    } else {
      url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query as string)}&key=${API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 404) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' }, 
      { status: 500 }
    );
  }
} 