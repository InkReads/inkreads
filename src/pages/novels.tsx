import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import HomeLayout from '../modules/layouts/home-layout';
import "../app/globals.css";
//for new pages, be sure to import the global css file as well as the TopNavBar component
//include TopNavBar as a wrapper for the page content

export default function GenrePage() {
  const router = useRouter();
  const { genre } = router.query;
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (genre) {
      fetchBooksByGenre(genre as string);
    }
  }, [genre]);

  const fetchBooksByGenre = async (genre: string) => {
    try {
      const response = await fetch(`http://localhost:5000/books?genre=${genre}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <HomeLayout>
        <p>hi</p>
  </HomeLayout>
  );
}