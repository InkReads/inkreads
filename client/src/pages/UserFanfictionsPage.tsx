import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ThumbsUp, ThumbsDown, Trash2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  arrayUnion, 
  arrayRemove,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import HomeLayout from '@/components/layouts/HomeLayout';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
}

interface UserFanfiction {
  id: string;
  title: string;
  author: string;
  authorId: string;
  content: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
}

export default function UserFanfictionsPage() {
  const { user } = useAuthStore();
  const [fanfictions, setFanfictions] = useState<UserFanfiction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFanfiction, setExpandedFanfiction] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchFanfictions = async () => {
      try {
        const fanfictionsRef = collection(db, 'user_fanfictions');
        const q = query(fanfictionsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fanfictionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserFanfiction[];
        setFanfictions(fanfictionsData);
      } catch (error) {
        console.error('Error fetching fanfictions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFanfictions();
  }, []);

  const fetchComments = async (fanfictionId: string) => {
    try {
      const commentsRef = collection(db, `user_fanfictions/${fanfictionId}/comments`);
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(prev => ({ ...prev, [fanfictionId]: commentsData }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleVote = async (fanfictionId: string, type: 'like' | 'dislike') => {
    if (!user) return;

    const fanfictionRef = doc(db, 'user_fanfictions', fanfictionId);
    const fanfiction = fanfictions.find(f => f.id === fanfictionId);
    if (!fanfiction) return;

    const hasLiked = fanfiction.likes.includes(user.uid);
    const hasDisliked = fanfiction.dislikes.includes(user.uid);

    try {
      if (type === 'like') {
        if (hasLiked) {
          await updateDoc(fanfictionRef, {
            likes: arrayRemove(user.uid)
          });
        } else {
          await updateDoc(fanfictionRef, {
            likes: arrayUnion(user.uid),
            dislikes: hasDisliked ? arrayRemove(user.uid) : arrayRemove()
          });
        }
      } else {
        if (hasDisliked) {
          await updateDoc(fanfictionRef, {
            dislikes: arrayRemove(user.uid)
          });
        } else {
          await updateDoc(fanfictionRef, {
            dislikes: arrayUnion(user.uid),
            likes: hasLiked ? arrayRemove(user.uid) : arrayRemove()
          });
        }
      }

      // Update local state
      setFanfictions(prev => prev.map(f => {
        if (f.id === fanfictionId) {
          let newLikes = [...f.likes];
          let newDislikes = [...f.dislikes];

          if (type === 'like') {
            if (hasLiked) {
              newLikes = newLikes.filter(id => id !== user.uid);
            } else {
              newLikes.push(user.uid);
              newDislikes = newDislikes.filter(id => id !== user.uid);
            }
          } else {
            if (hasDisliked) {
              newDislikes = newDislikes.filter(id => id !== user.uid);
            } else {
              newDislikes.push(user.uid);
              newLikes = newLikes.filter(id => id !== user.uid);
            }
          }

          return { ...f, likes: newLikes, dislikes: newDislikes };
        }
        return f;
      }));
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  const handleCommentVote = async (fanfictionId: string, commentId: string, type: 'like' | 'dislike') => {
    if (!user) return;

    const commentRef = doc(db, `user_fanfictions/${fanfictionId}/comments`, commentId);
    const comment = comments[fanfictionId]?.find(c => c.id === commentId);
    if (!comment) return;

    const hasLiked = comment.likes.includes(user.uid);
    const hasDisliked = comment.dislikes.includes(user.uid);

    try {
      if (type === 'like') {
        if (hasLiked) {
          await updateDoc(commentRef, {
            likes: arrayRemove(user.uid)
          });
        } else {
          await updateDoc(commentRef, {
            likes: arrayUnion(user.uid),
            dislikes: hasDisliked ? arrayRemove(user.uid) : arrayRemove()
          });
        }
      } else {
        if (hasDisliked) {
          await updateDoc(commentRef, {
            dislikes: arrayRemove(user.uid)
          });
        } else {
          await updateDoc(commentRef, {
            dislikes: arrayUnion(user.uid),
            likes: hasLiked ? arrayRemove(user.uid) : arrayRemove()
          });
        }
      }

      // Update local state
      setComments(prev => ({
        ...prev,
        [fanfictionId]: prev[fanfictionId].map(c => {
          if (c.id === commentId) {
            let newLikes = [...c.likes];
            let newDislikes = [...c.dislikes];

            if (type === 'like') {
              if (hasLiked) {
                newLikes = newLikes.filter(id => id !== user.uid);
              } else {
                newLikes.push(user.uid);
                newDislikes = newDislikes.filter(id => id !== user.uid);
              }
            } else {
              if (hasDisliked) {
                newDislikes = newDislikes.filter(id => id !== user.uid);
              } else {
                newDislikes.push(user.uid);
                newLikes = newLikes.filter(id => id !== user.uid);
              }
            }

            return { ...c, likes: newLikes, dislikes: newDislikes };
          }
          return c;
        })
      }));
    } catch (error) {
      console.error('Error updating comment vote:', error);
    }
  };

  const handleDelete = async (fanfictionId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'user_fanfictions', fanfictionId));
      setFanfictions(prev => prev.filter(f => f.id !== fanfictionId));
    } catch (error) {
      console.error('Error deleting fanfiction:', error);
    }
  };

  const handleAddComment = async (fanfictionId: string) => {
    if (!user || !newComment.trim()) return;

    try {
      const commentsRef = collection(db, `user_fanfictions/${fanfictionId}/comments`);
      const commentData = {
        content: newComment,
        author: user.displayName || user.email,
        authorId: user.uid,
        likes: [],
        dislikes: [],
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(commentsRef, commentData);
      const newCommentObj = {
        id: docRef.id,
        ...commentData,
        createdAt: new Date().toISOString()
      } as Comment;

      setComments(prev => ({
        ...prev,
        [fanfictionId]: [newCommentObj, ...(prev[fanfictionId] || [])]
      }));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleComments = async (fanfictionId: string) => {
    if (expandedFanfiction === fanfictionId) {
      setExpandedFanfiction(null);
    } else {
      setExpandedFanfiction(fanfictionId);
      if (!comments[fanfictionId]) {
        await fetchComments(fanfictionId);
      }
    }
  };

  // Sort fanfictions by net likes (likes - dislikes)
  const sortedFanfictions = [...fanfictions].sort((a, b) => {
    const netLikesA = a.likes.length - a.dislikes.length;
    const netLikesB = b.likes.length - b.dislikes.length;
    return netLikesB - netLikesA;
  });

  return (
    <HomeLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-900">User Created Fanfictions</h1>
            {user && (
              <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white">
                <Link to="/fanfiction/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Story
                </Link>
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : sortedFanfictions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-indigo-600/70">No fanfictions have been created yet. Be the first to share your story!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {sortedFanfictions.map((fanfiction) => (
                <div
                  key={fanfiction.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{fanfiction.title}</h2>
                      <p className="text-gray-600 mb-4">By {fanfiction.author}</p>
                      <p className="text-gray-700 mb-4 line-clamp-3">{fanfiction.content}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(fanfiction.id, 'like')}
                          className={`flex items-center gap-1 ${
                            user && fanfiction.likes.includes(user.uid)
                              ? 'text-green-600'
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                        >
                          <ThumbsUp className="h-5 w-5" />
                          <span>{fanfiction.likes.length}</span>
                        </button>
                        <button
                          onClick={() => handleVote(fanfiction.id, 'dislike')}
                          className={`flex items-center gap-1 ${
                            user && fanfiction.dislikes.includes(user.uid)
                              ? 'text-red-600'
                              : 'text-gray-400 hover:text-red-600'
                          }`}
                        >
                          <ThumbsDown className="h-5 w-5" />
                          <span>{fanfiction.dislikes.length}</span>
                        </button>
                      </div>
                      {user && user.uid === fanfiction.authorId && (
                        <button
                          onClick={() => handleDelete(fanfiction.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Posted on {new Date(fanfiction.createdAt).toLocaleDateString()}
                  </div>

                  {/* Comments Section */}
                  <div className="mt-4 border-t pt-4">
                    <button
                      onClick={() => toggleComments(fanfiction.id)}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>View Comments</span>
                    </button>

                    {expandedFanfiction === fanfiction.id && (
                      <div className="mt-4 space-y-4">
                        {user && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Write a comment..."
                              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <Button
                              onClick={() => handleAddComment(fanfiction.id)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white"
                            >
                              Post
                            </Button>
                          </div>
                        )}

                        <div className="space-y-4">
                          {comments[fanfiction.id]?.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">{comment.author}</p>
                                  <p className="text-gray-700 mt-1">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleCommentVote(fanfiction.id, comment.id, 'like')}
                                    className={`flex items-center gap-1 ${
                                      user && comment.likes.includes(user.uid)
                                        ? 'text-green-600'
                                        : 'text-gray-400 hover:text-green-600'
                                    }`}
                                  >
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>{comment.likes.length}</span>
                                  </button>
                                  <button
                                    onClick={() => handleCommentVote(fanfiction.id, comment.id, 'dislike')}
                                    className={`flex items-center gap-1 ${
                                      user && comment.dislikes.includes(user.uid)
                                        ? 'text-red-600'
                                        : 'text-gray-400 hover:text-red-600'
                                    }`}
                                  >
                                    <ThumbsDown className="h-4 w-4" />
                                    <span>{comment.dislikes.length}</span>
                                  </button>
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
} 