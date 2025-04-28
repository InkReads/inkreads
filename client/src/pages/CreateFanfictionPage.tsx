import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import HomeLayout from '@/components/layouts/HomeLayout';

const GENRES = [
  "Romance",
  "Adventure",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Horror",
  "Drama",
  "Comedy",
  "Action",
  "Slice of Life"
] as const;

export default function CreateFanfictionPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [genre, setGenre] = useState('');
  const [originalWork, setOriginalWork] = useState('');
  const [useCustomAuthor, setUseCustomAuthor] = useState(false);
  const [customAuthor, setCustomAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const fanfictionsRef = collection(db, 'user_fanfictions');
      await addDoc(fanfictionsRef, {
        title,
        content,
        genre,
        originalWork,
        author: useCustomAuthor ? customAuthor : (user.displayName || user.email),
        authorId: user.uid,
        likes: [],
        dislikes: [],
        createdAt: new Date().toISOString()
      });
      navigate('/fanfiction/user');
    } catch (error) {
      console.error('Error creating fanfiction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <HomeLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-indigo-900 mb-4">Please log in to create fanfiction</h1>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-indigo-900 mb-8">Create New Fanfiction</h1>
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your fanfiction title"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                <option value="">Select a genre</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="originalWork" className="block text-sm font-medium text-gray-700">
                Original Work
              </label>
              <Input
                id="originalWork"
                value={originalWork}
                onChange={(e) => setOriginalWork(e.target.value)}
                placeholder="What is this fanfiction based on? (e.g., Harry Potter, Star Wars)"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useCustomAuthor"
                  checked={useCustomAuthor}
                  onChange={(e) => setUseCustomAuthor(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="useCustomAuthor" className="text-sm font-medium text-gray-700">
                  Use custom author name
                </label>
              </div>
              {useCustomAuthor && (
                <div className="space-y-2">
                  <label htmlFor="customAuthor" className="block text-sm font-medium text-gray-700">
                    Author Name
                  </label>
                  <Input
                    id="customAuthor"
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    placeholder="Enter your author name"
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your fanfiction here..."
                className="min-h-[400px]"
                required
              />
            </div>

            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Fanfiction'}
            </Button>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
} 