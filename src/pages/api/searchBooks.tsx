// Description: This file is used to fetch data from Google Books API.
// Fetches books based on the query parameter passed to the API.
// The API key is stored in the API_KEY variable.
// Returns the fetched data as a JSON response.
// If an error occurs, returns a 500 status code with an error message.
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase.config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const API_KEY = "AIzaSyDgJPiCmoXqn6Op8T9WwiwJCMia8Pe0kvg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { query: searchQuery } = req.query;
        
        if (!searchQuery || typeof searchQuery !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const booksRef = collection(db, 'books');
        const q = query(booksRef, where('title', '>=', searchQuery), where('title', '<=', searchQuery + '\uf8ff'));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ message: 'Error fetching books', error: err instanceof Error ? err.message : 'Unknown error' });
    }
}