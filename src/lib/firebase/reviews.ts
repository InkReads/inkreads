import { db } from '@/lib/firebase.config';
import { collection, addDoc, query, where, getDocs, orderBy, limit, startAfter, doc, deleteDoc } from 'firebase/firestore';

export interface Review {
    id: string;
    userId: string;
    username: string;
    content: string;
    date: string;
    bookId: string;
    upvotes: number;
    downvotes: number;
}

export async function addReview(review: Omit<Review, 'id'>) {
    try {
        const reviewsRef = collection(db, 'reviews');
        const docRef = await addDoc(reviewsRef, review);
        return { ...review, id: docRef.id };
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
}

export async function deleteReview(reviewId: string) {
    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        await deleteDoc(reviewRef);
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
}

export async function getBookReviews(bookId: string, lastReview: Review | null = null, pageSize: number = 10) {
    try {
        const reviewsRef = collection(db, 'reviews');
        let reviewQuery = query(
            reviewsRef,
            where('bookId', '==', bookId),
            orderBy('date', 'desc'),
            limit(pageSize)
        );

        // If there's a last review, start after it for pagination
        if (lastReview) {
            reviewQuery = query(
                reviewsRef,
                where('bookId', '==', bookId),
                orderBy('date', 'desc'),
                startAfter(lastReview.date),
                limit(pageSize)
            );
        }

        const querySnapshot = await getDocs(reviewQuery);
        const reviews: Review[] = [];
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() } as Review);
        });

        // Return both the reviews and whether there are more to load
        return {
            reviews,
            hasMore: reviews.length === pageSize
        };
    } catch (error) {
        console.error('Error getting reviews:', error);
        throw error;
    }
} 