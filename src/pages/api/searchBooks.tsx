// Description: This file is used to fetch data from Google Books API.
// Fetches books based on the query parameter passed to the API.
// The API key is stored in the API_KEY variable.
// Returns the fetched data as a JSON response.
// If an error occurs, returns a 500 status code with an error message.
import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = "AIzaSyDgJPiCmoXqn6Op8T9WwiwJCMia8Pe0kvg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching books', error: err.message });
    }
}