import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import HomeLayout from '@/components/layouts/HomeLayout';
import HomeNavbar from '@/components/HomeNavbar';

interface UserProfile {
  uid: string;
  username: string;
  email: string;
  followers: string[];
  following: string[];
  bio?: string;
  joinDate?: string;
  reviewCount?: number;
  readingListsCount?: number;
  upvotes?: number;
  downvotes?: number;
}

const formatJoinDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 100;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as UserProfile;
          
          // Fetch all books that this user has voted on
          const booksRef = collection(db, "books");
          const booksQuery = query(booksRef);
          const booksSnapshot = await getDocs(booksQuery);
          
          // Calculate total books upvoted and downvoted
          let totalUpvoted = 0;
          let totalDownvoted = 0;
          const userId = querySnapshot.docs[0].id;
          
          booksSnapshot.forEach(doc => {
            const book = doc.data();
            if (book.upvotes?.includes(userId)) {
              totalUpvoted++;
            }
            if (book.downvotes?.includes(userId)) {
              totalDownvoted++;
            }
          });

          // Fetch all reviews by this user
          const reviewsRef = collection(db, "reviews");
          const reviewsQuery = query(reviewsRef, where("userId", "==", userId));
          const reviewsSnapshot = await getDocs(reviewsQuery);
          
          setProfile({
            ...userData,
            uid: querySnapshot.docs[0].id,
            followers: userData.followers || [],
            following: userData.following || [],
            upvotes: totalUpvoted,
            downvotes: totalDownvoted,
            reviewCount: reviewsSnapshot.size
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleToggleFollow = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !profile) return;

    try {
      const targetUserRef = doc(db, "users", profile.uid);
      const currentUserRef = doc(db, "users", currentUser.uid);
      const isFollowing = profile.followers.includes(currentUser.uid);

      if (isFollowing) {
        // Unfollow
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUser.uid)
        });
        await updateDoc(currentUserRef, {
          following: arrayRemove(profile.uid)
        });
        setProfile(prev => prev ? {
          ...prev,
          followers: prev.followers.filter(id => id !== currentUser.uid)
        } : null);
      } else {
        // Follow
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUser.uid)
        });
        await updateDoc(currentUserRef, {
          following: arrayUnion(profile.uid)
        });
        setProfile(prev => prev ? {
          ...prev,
          followers: [...prev.followers, currentUser.uid]
        } : null);
      }
    } catch (error) {
      console.error("Toggle follow error:", error);
    }
  };

  const handleEditBio = async () => {
    if (!auth.currentUser || !profile || auth.currentUser.uid !== profile.uid) return;
    if (charCount > MAX_CHARS) return;

    try {
      const userRef = doc(db, "users", profile.uid);
      await updateDoc(userRef, {
        bio: editedBio
      });
      setProfile(prev => prev ? { ...prev, bio: editedBio } : null);
      setIsEditingBio(false);
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCharCount(text.length);
    setEditedBio(text);
  };

  const handleStartEditing = () => {
    const initialBio = profile?.bio || "";
    setEditedBio(initialBio);
    setCharCount(initialBio.length);
    setIsEditingBio(true);
  };

  const handleCancelEditing = () => {
    setIsEditingBio(false);
  };

  return (
    <HomeLayout>
      <HomeNavbar />
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-white to-indigo-50/50">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            Loading...
          </div>
        ) : !profile ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            User not found
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8">
              {/* Top Profile Card */}
              <div className="flex flex-col gap-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-50 ring-1 ring-indigo-100 w-full max-w-4xl mx-auto">
                <div className="flex gap-8">
                  {/* Left side - Profile picture and username */}
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="text-4xl bg-black text-white">
                        {profile.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">{profile.username}</h1>
                    {auth.currentUser && auth.currentUser.uid !== profile.uid && (
                      <Button
                        onClick={handleToggleFollow}
                        variant={profile.followers.includes(auth.currentUser.uid) ? "outline" : "default"}
                        className="w-28"
                      >
                        {profile.followers.includes(auth.currentUser.uid) ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>

                  {/* Right side - Followers, following, and bio */}
                  <div className="flex flex-col gap-4 flex-1 min-w-0">
                    <div className="flex gap-8">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold">{profile.followers.length}</span>
                        <span className="text-sm text-gray-600">followers</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold">{profile.following.length}</span>
                        <span className="text-sm text-gray-600">following</span>
                      </div>
                    </div>
                    <div className="mt-4 w-full">
                      {isEditingBio ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editedBio}
                            onChange={handleBioChange}
                            placeholder="Write something about yourself..."
                            className="min-h-[100px] max-h-[200px] resize-none w-full"
                          />
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              {charCount}/{MAX_CHARS} characters
                              {charCount > MAX_CHARS && (
                                <span className="text-red-500 ml-2">(Too many characters)</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEditing}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleEditBio}
                                disabled={charCount > MAX_CHARS}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 w-full">
                          <p className="text-gray-700 break-words overflow-hidden overflow-wrap-anywhere w-full">
                            {profile.bio || "No bio available"}
                          </p>
                          {auth.currentUser && auth.currentUser.uid === profile.uid && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleStartEditing}
                              className="h-8 px-2 flex-shrink-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex gap-8 max-w-4xl mx-auto w-full">
                {/* Stats Box */}
                <div className="flex flex-col gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-indigo-50 ring-1 ring-indigo-100 w-1/3">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Joined</span>
                      <span className="font-medium">
                        {formatJoinDate(profile.joinDate)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Reviews</span>
                      <span className="font-medium">{profile.reviewCount || 0}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Books Upvoted</span>
                      <span className="font-medium">{profile.upvotes || 0}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Books Downvoted</span>
                      <span className="font-medium">{profile.downvotes || 0}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Reviews Written</span>
                      <span className="font-medium">{profile.reviewCount || 0}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500">Reading Lists</span>
                      <span className="font-medium">{profile.readingListsCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Reading Lists Box */}
                <div className="flex flex-col gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-indigo-50 ring-1 ring-indigo-100 flex-1">
                  <h2 className="text-xl font-semibold">Reading Lists</h2>
                  {/* Reading lists content will go here */}
                  <p className="text-gray-500">Reading lists coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </HomeLayout>
  );
} 