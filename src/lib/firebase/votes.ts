import { db } from '@/lib/firebase.config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface VoteData {
    upvoters: string[];
    downvoters: string[];
}

export async function getVotes(type: 'book' | 'review', id: string): Promise<VoteData> {
    const voteRef = doc(db, `${type}Votes`, id);
    const voteDoc = await getDoc(voteRef);
    
    if (!voteDoc.exists()) {
        // Initialize vote document if it doesn't exist
        const initialVoteData: VoteData = {
            upvoters: [],
            downvoters: []
        };
        await setDoc(voteRef, initialVoteData);
        return initialVoteData;
    }
    
    return voteDoc.data() as VoteData;
}

export async function handleVote(
    type: 'book' | 'review',
    id: string,
    userId: string,
    voteType: 'upvote' | 'downvote'
): Promise<{ upvotes: number; downvotes: number }> {
    const voteRef = doc(db, `${type}Votes`, id);
    const voteData = await getVotes(type, id);
    
    const isUpvoting = voteType === 'upvote';
    const votersArray = isUpvoting ? 'upvoters' : 'downvoters';
    const oppositeArray = isUpvoting ? 'downvoters' : 'upvoters';
    
    const hasVoted = voteData[votersArray].includes(userId);
    const hasOppositeVote = voteData[oppositeArray].includes(userId);

    if (hasVoted) {
        // Remove vote if already voted
        await updateDoc(voteRef, {
            [votersArray]: arrayRemove(userId)
        });
    } else {
        // Add new vote and remove opposite vote if exists
        await updateDoc(voteRef, {
            [votersArray]: arrayUnion(userId),
            ...(hasOppositeVote && { [oppositeArray]: arrayRemove(userId) })
        });
    }

    // Get updated vote counts
    const updatedVoteData = await getVotes(type, id);
    return {
        upvotes: updatedVoteData.upvoters.length,
        downvotes: updatedVoteData.downvoters.length
    };
}

export async function getUserVotes(
    type: 'book' | 'review',
    ids: string[],
    userId: string
): Promise<Record<string, 'upvote' | 'downvote' | null>> {
    const votes: Record<string, 'upvote' | 'downvote' | null> = {};
    
    for (const id of ids) {
        const voteData = await getVotes(type, id);
        if (voteData.upvoters.includes(userId)) {
            votes[id] = 'upvote';
        } else if (voteData.downvoters.includes(userId)) {
            votes[id] = 'downvote';
        } else {
            votes[id] = null;
        }
    }
    
    return votes;
} 