import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2, MessageSquare, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: any;
  upvotes: string[];
  downvotes: string[];
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fanfictionId: string;
}

export default function CommentsModal({ isOpen, onClose, fanfictionId }: CommentsModalProps) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fanfictionId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const commentsRef = collection(db, 'fanfictions', fanfictionId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const commentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      setComments(commentsList);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (commentId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) return;
    
    try {
      const commentRef = doc(db, 'fanfictions', fanfictionId, 'comments', commentId);
      const comment = comments.find(c => c.id === commentId);
      
      if (!comment) return;
      
      const userId = user.uid;
      const upvotes = comment.upvotes || [];
      const downvotes = comment.downvotes || [];
      
      // Check if user has already voted
      const hasUpvoted = upvotes.includes(userId);
      const hasDownvoted = downvotes.includes(userId);
      
      let newUpvotes = [...upvotes];
      let newDownvotes = [...downvotes];
      
      if (voteType === 'upvote') {
        if (hasUpvoted) {
          // Remove upvote
          newUpvotes = upvotes.filter(id => id !== userId);
        } else {
          // Add upvote and remove downvote if exists
          newUpvotes.push(userId);
          newDownvotes = downvotes.filter(id => id !== userId);
        }
      } else {
        if (hasDownvoted) {
          // Remove downvote
          newDownvotes = downvotes.filter(id => id !== userId);
        } else {
          // Add downvote and remove upvote if exists
          newDownvotes.push(userId);
          newUpvotes = upvotes.filter(id => id !== userId);
        }
      }
      
      // Update Firestore
      await updateDoc(commentRef, {
        upvotes: newUpvotes,
        downvotes: newDownvotes
      });
      
      // Update local state
      setComments(prev => prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            upvotes: newUpvotes,
            downvotes: newDownvotes
          };
        }
        return c;
      }));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const commentsRef = collection(db, 'fanfictions', fanfictionId, 'comments');
      await addDoc(commentsRef, {
        content: newComment.trim(),
        author: user.displayName || 'Anonymous',
        authorId: user.uid,
        createdAt: serverTimestamp(),
        upvotes: [],
        downvotes: []
      });

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const commentRef = doc(db, 'fanfictions', fanfictionId, 'comments', commentId);
      await deleteDoc(commentRef);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          {/* Comment Form */}
          {user && (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full h-24 mb-2"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Comments List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="mt-2 text-gray-600">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{comment.author}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                    {user && user.uid === comment.authorId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  {user && (
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-2 ${
                          comment.upvotes?.includes(user.uid)
                            ? "text-green-600 hover:text-green-700"
                            : "text-gray-600 hover:text-gray-700"
                        }`}
                        onClick={() => handleVote(comment.id, 'upvote')}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.upvotes?.length || 0}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-2 ${
                          comment.downvotes?.includes(user.uid)
                            ? "text-red-600 hover:text-red-700"
                            : "text-gray-600 hover:text-gray-700"
                        }`}
                        onClick={() => handleVote(comment.id, 'downvote')}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{comment.downvotes?.length || 0}</span>
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 