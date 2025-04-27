import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Trash2, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import CommentsModal from './CommentsModal';

interface Fanfiction {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: any;
  universe: string;
  tags: string[];
  upvotes: string[];
  downvotes: string[];
}

export default function FanfictionSection() {
  const { user } = useAuthStore();
  const [fanfictions, setFanfictions] = useState<Fanfiction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFanfictionId, setSelectedFanfictionId] = useState<string | null>(null);
  const [newFanfiction, setNewFanfiction] = useState({
    title: '',
    content: '',
    universe: '',
    tags: ''
  });

  useEffect(() => {
    fetchFanfictions();
  }, []);

  const fetchFanfictions = async () => {
    try {
      setLoading(true);
      const fanfictionsRef = collection(db, 'fanfictions');
      const q = query(fanfictionsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fanfictionsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Fanfiction[];
      
      // Sort fanfictions by net votes (upvotes - downvotes)
      const sortedFanfictions = fanfictionsList.sort((a, b) => {
        const aNetVotes = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
        const bNetVotes = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
        return bNetVotes - aNetVotes;
      });
      
      setFanfictions(sortedFanfictions);
    } catch (error) {
      console.error('Error fetching fanfictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (fanfictionId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) return;
    
    try {
      const fanfictionRef = doc(db, 'fanfictions', fanfictionId);
      const fanfiction = fanfictions.find(f => f.id === fanfictionId);
      
      if (!fanfiction) return;
      
      const userId = user.uid;
      const upvotes = fanfiction.upvotes || [];
      const downvotes = fanfiction.downvotes || [];
      
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
      await updateDoc(fanfictionRef, {
        upvotes: newUpvotes,
        downvotes: newDownvotes
      });
      
      // Update local state
      setFanfictions(prev => {
        const updated = prev.map(f => {
          if (f.id === fanfictionId) {
            return {
              ...f,
              upvotes: newUpvotes,
              downvotes: newDownvotes
            };
          }
          return f;
        });
        
        // Re-sort by net votes
        return updated.sort((a, b) => {
          const aNetVotes = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
          const bNetVotes = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
          return bNetVotes - aNetVotes;
        });
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const fanfictionsRef = collection(db, 'fanfictions');
      await addDoc(fanfictionsRef, {
        ...newFanfiction,
        author: user.displayName || 'Anonymous',
        authorId: user.uid,
        createdAt: serverTimestamp(),
        tags: newFanfiction.tags.split(',').map(tag => tag.trim()),
        upvotes: [],
        downvotes: []
      });

      setNewFanfiction({
        title: '',
        content: '',
        universe: '',
        tags: ''
      });
      setShowUploadForm(false);
      fetchFanfictions();
    } catch (error) {
      console.error('Error uploading fanfiction:', error);
    }
  };

  const handleDelete = async (fanfictionId: string) => {
    if (!user) return;
    
    try {
      const fanfictionRef = doc(db, 'fanfictions', fanfictionId);
      await deleteDoc(fanfictionRef);
      setFanfictions(prev => prev.filter(f => f.id !== fanfictionId));
    } catch (error) {
      console.error('Error deleting fanfiction:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with Upload Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-900">Fanfiction Stories</h2>
        {user && (
          <Button
            onClick={() => setShowUploadForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload Story
          </Button>
        )}
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newFanfiction.title}
                onChange={(e) => setNewFanfiction(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Universe/Original Work
              </label>
              <input
                type="text"
                value={newFanfiction.universe}
                onChange={(e) => setNewFanfiction(prev => ({ ...prev, universe: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={newFanfiction.content}
                onChange={(e) => setNewFanfiction(prev => ({ ...prev, content: e.target.value }))}
                className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={newFanfiction.tags}
                onChange={(e) => setNewFanfiction(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="romance, adventure, fantasy"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUploadForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Upload Story
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Fanfiction List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="mt-4 text-lg text-indigo-600/70">Loading stories...</p>
        </div>
      ) : fanfictions.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm max-w-md mx-auto border border-indigo-50">
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">
              No stories yet
            </h3>
            <p className="text-indigo-600/70">
              Be the first to share your fanfiction story!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {fanfictions.map((fanfiction) => (
            <motion.div
              key={fanfiction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{fanfiction.title}</h3>
                  <p className="text-sm text-gray-500">
                    by {fanfiction.author} • {new Date(fanfiction.createdAt?.toDate()).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {fanfiction.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {user && user.uid === fanfiction.authorId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(fanfiction.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{fanfiction.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Universe: {fanfiction.universe}</span>
                </div>
                <div className="flex items-center gap-4">
                  {user && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-2 ${
                          fanfiction.upvotes?.includes(user.uid)
                            ? "text-green-600 hover:text-green-700"
                            : "text-gray-600 hover:text-gray-700"
                        }`}
                        onClick={() => handleVote(fanfiction.id, 'upvote')}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{fanfiction.upvotes?.length || 0}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-2 ${
                          fanfiction.downvotes?.includes(user.uid)
                            ? "text-red-600 hover:text-red-700"
                            : "text-gray-600 hover:text-gray-700"
                        }`}
                        onClick={() => handleVote(fanfiction.id, 'downvote')}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{fanfiction.downvotes?.length || 0}</span>
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                    onClick={() => setSelectedFanfictionId(fanfiction.id)}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Comments</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Comments Modal */}
      <CommentsModal
        isOpen={!!selectedFanfictionId}
        onClose={() => setSelectedFanfictionId(null)}
        fanfictionId={selectedFanfictionId || ''}
      />
    </div>
  );
} 