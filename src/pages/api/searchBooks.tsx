// Description: This file is used to fetch data from Google Books API.
// Fetches books based on the query parameter passed to the API.
// The API key is stored in the API_KEY variable.
// Returns the fetched data as a JSON response.
// If an error occurs, returns a 500 status code with an error message.
import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = "AIzaSyDgJPiCmoXqn6Op8T9WwiwJCMia8Pe0kvg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query, bookId } = req.query;
    
    if (!query && !bookId) {
        return res.status(400).json({ error: 'Either query or bookId parameter is required' });
    }
    
    try {
        let url;
        if (bookId) {
            url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`;
        } else {
            url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query as string)}&key=${API_KEY}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.status === 404) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        res.status(200).json(data);
<<<<<<< Updated upstream
    } catch (err) {
        res.status(500).json({ message: 'Error fetching books', error: err.message });
=======
    } catch {
        res.status(500).json({ message: 'Failed to fetch books' });
>>>>>>> Stashed changes
    }
}